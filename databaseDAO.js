let mongoose = require("mongoose");

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
  newPlant.save(function (err) {
    if (err) {
      console.log("Failed to store plant data", err);
    } else {
      console.log("Successfully stored plant data");
    }
  });
}

function returnAllPlants() {
  return;
}

module.exports = { storePlant, returnAllPlants };
