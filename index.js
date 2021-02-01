const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dbDAO = require("./databaseDAO");
const plantAPI = require("./routes/plantAPI");
const userAPI = require("./routes/userAPI");
const app = express();

// Connect to the database. Should be one of the first things done when the app is started
mongoose.connect(
  "mongodb://localhost:27017/plantwebapp",
  {
    useNewUrlParser: true,
  },
  function () {
    // This outputs to the terminal (running on server), not the web browser/app
    console.log("Connected to db.");
  }
);
app.use(express.static("public"));
app.use(express.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing form data

app.get("/addplant", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/html/new_plant.html"));
});

app.get("/home", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/html/home.html"));
});

app.get("/signup", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/html/signup.html"));
});

// The user endpoint is not required. It can be added for debugging
app.post("/user", userAPI.createUser);

app.post("/plant", plantAPI.createPlant);
app.get("/plant", plantAPI.getPlants);

app.listen(8080, function () {
  console.log("Listening on port 8080!");
});
