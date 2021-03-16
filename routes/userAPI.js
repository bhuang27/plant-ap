const dbDAO = require("../databaseDAO");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// The secret was generated using require('crypto').randomBytes(64).toString('hex')
const saltRounds = 10;

function validateLoginData(email, password) {
  let dataIsValid = true;
  if (email === undefined || email.length === 0) {
    console.log(`Email property with value [${email}] did not pass validation`);
    dataIsValid = false;
  }
  if (password === undefined || password.length === 0) {
    console.log(
      `Password property with value [${password}] did not pass validation`
    );
    dataIsValid = false;
  }
  return dataIsValid;
}

function InvalidUser(message) {
  this.message = message;
  this.name = "INVALID_USER";
}

function loginUser(req, res) {
  let userData = req.body;
  let dataIsValid = validateLoginData(userData.email, userData.password);
  if (!dataIsValid) {
    // return an error status code
    res.status(400).send("Bad request. User was not added.");
    return;
  }

  let userId;
  // Get the user password from the DB
  dbDAO
    .getUser(userData.email)
    .then((user) => {
      if (user === null) {
        throw new InvalidUser("Bad request. The user does not exist.");
      }

      userId = user.id;

      // Use the db password to compare with the entered password
      return bcrypt.compare(userData.password, user.password);
    })
    .then((result) => {
      if (result === false) {
        res.status(400).send("Incorrect password. Try again.");
        return;
      }
      // this is json web token authorization.
      // TODO: look into session based authorization
      // Create the token and sign it on the server
      let token = generateAccessToken(userId); //jwt.sign({ id: userData.id }, secret, { expiresIn: "24h" });

      // TODO: figure out how to ues the access and refresh tokens
      // res.json({accessToken: tokenm refreshToken: refreshToken})
      // Send the token to the client in a cookie
      // the first arg in the cookie is the name of it, the second is the token
      res.status(200).cookie("auth_token", token).send();
    })
    .catch((error) => {
      if (error.name === "INVALID_USER") {
        // log an error to the server
        console.error("The user does not exist");
        // return the status to the client
        res.status(400).send("Bad request. The user does not exist.");
        return;
      }
      // console.error(err);
    });
  // Get the hash from the db: 1 - user exitsts 2 - user dne
  // User bcrypt lib to compare password from body to db. Pass or fail
  // If pass, create a token that will be proof and send back to client (cookie)
}

// We can have a separate server for authentication
// This server will handle requests only
// The refresh tokens should be saved on the database
function generateAccessToken(userId) {
  // The expire should be 15-30 min
  return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "24h",
  });
}

function createUser(req, res) {
  let userData = req.body;

  //   Perform general data validation
  let dataIsValid = validateLoginData(userData.email, userData.password);

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

module.exports = { createUser, loginUser };
