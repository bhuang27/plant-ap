const dbDAO = require("../databaseDAO");

function createPlant(req, res) {
  let plantData = req.body;
  let dataIsValid = true;

  console.log(plantData);

  // Validate the data
  if (plantData.name === undefined || plantData.name.length === 0) {
    console.log(
      `Name property with value [${plantData.name}] did not pass validation`
    );
    dataIsValid = false;
  }
  if (
    plantData.frequency === undefined ||
    isNaN(parseInt(plantData.frequency))
  ) {
    console.log(
      `Frequency property with value [${plantData.frequency}] did not pass validation`
    );
    dataIsValid = false;
  }
  if (
    plantData.start_date === undefined ||
    isNaN(Date.parse(plantData.start_date))
  ) {
    console.log(
      `Date property with value [${plantData.start_date}] did not pass validation`
    );
    dataIsValid = false;
  }
  if (!dataIsValid) {
    // return an error status code
    res.status(400).send("Bad request. Plant was not added.");
    return;
  }
  // Add the raw plant data to the database
  let plantDataToStore = {
    name: plantData.name,
    frequency: parseInt(plantData.frequency),
    start_date: new Date(plantData.start_date),
    species_name: plantData.species_name,
    description: plantData.description,
  };
  dbDAO.storePlant(plantDataToStore);
  // Add a redirect to home page
  // res.redirect("/home");
  // Update the status to reflect that a plant was successfully added
  res.sendStatus(201);
}

function getPlants(req, res) {
  // Return plant collection data in form of json
  let allPlants = dbDAO.returnAllPlants();
  res.json(allPlants);
}

module.exports = { createPlant, getPlants };