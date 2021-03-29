require("dotenv").config();
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const passport = require("passport");

const plantAPI = require("./routes/plantAPI");
const userAPI = require("./routes/userAPI");
const authJWT = require("./auth");

// Pass the strategy to the module passport (allows configuration)
passport.use(authJWT);

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

const app = express();
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing form data
app.use(passport.initialize());
app.get("/", function (req, res) {
  res.redirect("/login");
});

app.get(
  "/addplant",
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
  function (req, res) {
    console.log(req);
    res.sendFile(path.join(__dirname + "/public/html/newPlant.html"));
  }
);

app.get(
  "/home",
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
  function (req, res) {
    res.sendFile(path.join(__dirname + "/public/html/home.html"));
  }
);

app.get("/signup", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/html/signup.html"));
});

// The user endpoint is not required. It can be added for debugging
app.post("/user", userAPI.createUser);

// New endpoint to authenticate users
app.get("/login", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/html/login.html"));
});

app.post("/login", userAPI.loginUser);

// app.get("/logout", userAPI.logoutUser);

app.post(
  "/plant",
  passport.authenticate("jwt", { session: false }),
  plantAPI.createPlant
);
app.get(
  "/plant",
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
  plantAPI.getPlants
);

app.get(
  "/myplant",
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
  function (req, res) {
    res.sendFile(path.join(__dirname + "/public/html/myPlant.html"));
  }
);

app.get(
  "/logout",
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
  function (req, res) {
    res.sendFile(path.join(__dirname + "/public/html/logout.html"));
  }
);

app.listen(8080, function () {
  console.log("Listening on port 8080!");
});
