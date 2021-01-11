const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
// const salutationsFns = require("./hello");
const app = express();

app.use(express.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing form data

app.get("/addplant", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/new_plant.html"));
});

app.get("/home", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/home.html"));
});

app.post("/plant", function (req, res) {
  console.log(req.body);
  res.redirect("/home");
  // Add a redirect to home page
});
// get is associated with the http verb request
// Dan calls /hello the route or the api
app.get("/hello", function (request, response) {
  // The query object has the query parameters
  // Example of 2 query parameters: http://localhost:8080/hi?name=daniel&grandma=peggy
  console.log(request.query);
  response.status(200).send("Hello Biznatch!");
});

// These are route parameters
// biznatch and grandma are properties of the params object
app.get("/hi/:biznatch/:grandma", function (request, response) {
  console.log(request.params);
  response
    .status(200)
    .send(`Hi ${request.params.biznatch} and ${request.params.grandma}`);
});

// app.get("/bye", function (request, response) {
//   response.status(200).send(salutationsFns.bye());
// });

app.post("/users", function (request, response) {
  console.log(request.body);
  response.status(200).send("new user");
});

app.listen(8080, function () {
  console.log("Listening on port 8080!");
});
