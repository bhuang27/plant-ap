const dbDAO = require("../databaseDAO");
// TODO: I will need to create a way for the user to update plants
// TODO: validate the plant data info after water
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
    plantData.water_frequency === undefined ||
    isNaN(parseInt(plantData.water_frequency))
  ) {
    console.log(
      `Date property with value [${plantData.water_frequency}] did not pass validation`
    );
    dataIsValid = false;
  }
  if (
    plantData.water_start_date === undefined ||
    isNaN(Date.parse(plantData.water_start_date))
  ) {
    console.log(
      `Date property with value [${plantData.water_start_date}] did not pass validation`
    );
    dataIsValid = false;
  }
  if (plantData.fert_frequency.length > 0) {
    if (
      typeof parseInt(plantData.fert_frequency) != "number" &&
      isFinite(parseInt(plantData.fert_frequency))
    ) {
      console.log(
        `Date property with value [${plantData.fert_frequency}] did not pass validation`
      );
      dataIsValid = false;
    }
  }
  // if (plantData.fert_start_date.length > 0) {
  //   if (typeof Date(plantData.fert_start_date) != "date") {
  //     console.log(
  //       `Date property with value [${plantData.fert_start_date}] did not pass validation`
  //     );
  //     dataIsValid = false;
  //   }
  // }
  // if (
  //   plantData.fert_frequency === undefined ||
  //   isNaN(Date.parse(plantData.fert_frequency))
  // ) {
  //   console.log("Data property was not provided");
  //   dataIsValid = true;
  // }
  // if (
  //   plantData.fert_start_date === undefined ||
  //   isNaN(Date.parse(plantData.fert_start_date))
  // ) {
  //   console.log("Data property was not provided");
  //   dataIsValid = true;
  // }
  // if (
  //   plantData.mist_frequency === undefined ||
  //   isNaN(Date.parse(plantData.mist_frequency))
  // ) {
  //   console.log("Data property was not provided");
  //   dataIsValid = true;
  // }
  // if (
  //   plantData.mist_start_date === undefined ||
  //   isNaN(Date.parse(plantData.mist_start_date))
  // ) {
  //   console.log("Data property was not provided");
  //   dataIsValid = true;
  // }
  // if (
  //   plantData.clean_frequency === undefined ||
  //   isNaN(Date.parse(plantData.clean_frequency))
  // ) {
  //   console.log("Data property was not provided");
  //   dataIsValid = true;
  // }
  // if (
  //   plantData.clean_start_date === undefined ||
  //   isNaN(Date.parse(plantData.clean_start_date))
  // ) {
  //   console.log("Data property was not provided");
  //   dataIsValid = true;
  // }
  // if (
  //   plantData.pot_start_date === undefined ||
  //   isNaN(Date.parse(plantData.pot_start_date))
  // ) {
  //   console.log("Data property was not provided");
  //   dataIsValid = true;
  // }
  // if (
  //   plantData.prune_start_date === undefined ||
  //   isNaN(Date.parse(plantData.prune_start_date))
  // ) {
  //   console.log("Data property was not provided");
  //   dataIsValid = true;
  // }
  if (!dataIsValid) {
    // return an error status code
    res.status(400).send("Bad request. Plant was not added.");
    return;
  }
  // Add the raw plant data to the database
  // User is stored under the request
  let plantDataToStore = {
    name: plantData.name,
    species_name: plantData.species_name,
    description: plantData.description,
    water_frequency: parseInt(plantData.water_frequency),
    water_start_date: new Date(plantData.water_start_date),
    fert_frequency: parseInt(plantData.fert_frequency),
    fert_start_date: new Date(plantData.fert_start_date),
    mist_frequency: parseInt(plantData.mist_frequency),
    mist_start_date: new Date(plantData.mist_start_date),
    clean_frequency: parseInt(plantData.clean_frequency),
    clean_start_date: new Date(plantData.clean_start_date),
    pot_start_date: new Date(plantData.pot_start_date),
    prune_start_date: new Date(plantData.prune_start_date),
    owner_id: req.user.id,
  };
  dbDAO
    .storePlant(plantDataToStore)
    .then((plantDoc) => {
      // This updates the status and sends the plantDoc as the body
      res.status(201).json(plantDoc);
    })
    .catch((err) => {
      console.error(err);
    });
}

function getPlants(req, res) {
  // Return plant collection data in form of json
  dbDAO
    .returnAllPlants()
    // This gets executed when the promise resolves
    .then((docs) => {
      // This returns a list of json objects
      res.json(docs);
    })
    .catch((err) => {
      console.error(err);
    });
}

function getUsersPlants(req, res) {
  dbDAO
    .returnUsersPlants(req.user.id)
    .then((docs) => {
      console.log(`${docs.length} plants have been added by the user.`);
      return res.json(docs);
    })
    .catch((err) => {
      console.error(err);
    });
}

module.exports = { createPlant, getPlants, getUsersPlants };
