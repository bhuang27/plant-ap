let mongoose = require("mongoose");
// To initialize the db type: mongod --dbpath data/db

const plantSchema = new mongoose.Schema({
  name: String,
  species_name: String,
  frequency: Number,
  start_date: Date,
  description: String,
  owner_id: String,
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const PlantModel = mongoose.model("Plant", plantSchema);

function storePlant(plant) {
  const newPlant = new PlantModel(plant);
  return new Promise((resolve, reject) => {
    newPlant.save(function (err, plantDoc) {
      if (err) {
        reject(err);
      } else {
        resolve(plantDoc);
      }
    });
  });
}

function returnAllPlants() {
  return new Promise((resolve, reject) => {
    PlantModel.find({}, function (err, docs) {
      if (err) {
        reject(err);
      } else {
        resolve(docs);
      }
    });
  });
}

function returnUsersPlants(userID) {
  return new Promise((resolve, reject) => {
    PlantModel.find({ owner_id: userID }, function (err, docs) {
      if (err) {
        reject(err);
      } else {
        resolve(docs);
      }
    });
  });
}

const UserModel = mongoose.model("User", userSchema);

function doesUserExist(userEmail) {
  // TODO look into promises
  return new Promise((resolve, reject) => {
    UserModel.findOne({ email: userEmail }, function (err, doc) {
      // A document is returned with all the user info
      if (err) {
        reject(err);
      } else if (doc) {
        resolve(true);
      } else {
        // This is a null scenario
        resolve(false);
      }
    });
  });
}

function getUser(userEmail) {
  return new Promise((resolve, reject) => {
    UserModel.findOne({ email: userEmail }, function (err, doc) {
      if (err) {
        reject(err);
      } else {
        // This can return a doc or null
        resolve(doc);
      }
    });
  });
}

function getUserByID(userID) {
  return new Promise((resolve, reject) => {
    UserModel.findById(userID, function (err, doc) {
      if (err) {
        reject(err);
      } else {
        // This can return a doc or null
        resolve(doc);
      }
    });
  });
}

function storeUser(user) {
  const newUser = new UserModel(user);
  return new Promise((resolve, reject) => {
    newUser.save(function (err, userDoc) {
      if (err) {
        reject(err);
      } else {
        resolve(userDoc);
      }
    });
  });
}

module.exports = {
  storePlant,
  returnAllPlants,
  returnUsersPlants,
  storeUser,
  doesUserExist,
  getUser,
  getUserByID,
};
