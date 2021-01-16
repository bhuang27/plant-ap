const db = [];

function storePlant(plant) {
  db.push(plant);
}

function returnAllPlants() {
  return db;
}

module.exports = { storePlant, returnAllPlants };
