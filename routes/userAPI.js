const dbDAO = require("../databaseDAO");

function createUser(req, res) {
  let userData = req.body;
  let dataIsValid = true;

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
}

module.exports = { createUser };
