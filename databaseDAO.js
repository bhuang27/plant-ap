let mongoose = require("mongoose");
// To initialize the db type: mongod --dbpath data/db

const plantSchema = new mongoose.Schema({
  name: String,
  species_name: String,
  frequency: Number,
  start_date: Date,
  description: String,
});

const PlantModel = mongoose.model("Plant", plantSchema);

function storePlant(plant) {
  const newPlant = new PlantModel(plant);
  return new Promise((resolve, reject) => {
    newPlant.save(function (err, plantDoc) {
      if (err) {
        reject(err);
        // console.log("Failed to store plant data", err);
      } else {
        resolve(plantDoc);
        // console.log("Successfully stored plant data");
      }
    });
  });
  // newPlant.save(function (err) {
  //   if (err) {
  //     console.log("Failed to store plant data", err);
  //   } else {
  //     console.log("Successfully stored plant data");
  //   }
  // });
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

module.exports = { storePlant, returnAllPlants };
