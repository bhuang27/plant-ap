const dbDAO = require("../databaseDAO");
const bcrypt = require("bcrypt");
const saltRounds = 10;

function createUser(req, res) {
  let userData = req.body;
  let dataIsValid = true;

  //   Perform general data validation
  if (userData.email === undefined || userData.email.length === 0) {
    console.log(
      `Email property with value [${userData.email}] did not pass validation`
    );
    dataIsValid = false;
  }
  if (userData.password === undefined || userData.password.length === 0) {
    console.log(
      `Password property with value [${userData.password}] did not pass validation`
    );
    dataIsValid = false;
  }

  if (!dataIsValid) {
    // return an error status code
    res.status(400).send("Bad request. User was not added.");
    return;
  }

  // Perform additional checks i.e., does the user already exist in the database?
  dbDAO
    .doesUserExist(userData.email)
    // If the email already exists, let the user know and exit
    .then((exists) => {
      // This updates the status and sends the userDoc as the body
      // The returned bool value needs to be assigned a name, hence exists
      if (exists) {
        res
          .status(400)
          .send(
            `An account was already created using the email: ${userData.email}`
          );
        return;
      }
      //  This code is nested to prevent the passwords from being hashed while the app is checking if the user exists
      //  Update the userData so that the password is encrypted
      bcrypt.hash(userData.password, saltRounds, function (err, hash) {
        // Store hash in your password DB.
        if (err) {
          res.sendStatus(500);
          // Must return after an error is encountered, else the code below executes
          return;
        }
        // Update the user password with the hash
        userData.password = hash;
        // Store the user info in the db
        dbDAO
          // userData is a javascript object
          .storeUser(userData)
          .then((userDoc) => {
            // This updates the status and sends the userDoc as the body
            res.status(201).json(userDoc);
          })
          .catch((err) => {
            console.error(err);
          });
      });
    })
    .catch((err) => {
      console.error(err);
    });
}

module.exports = { createUser };
