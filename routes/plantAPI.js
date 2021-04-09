const dbDAO = require("../databaseDAO");
// TODO: I will need to create a way for the user to update plants
// TODO: validate the plant data info after water
function createPlant(req, res) {
  let plantData = req.body;
  let dataIsValid = true;
  let plantDataToStore = new Map();
  let plantInfoFields = ["name", "species_name", "description"];
  let dateFields = [
    "water_start_date",
    "fert_start_date",
    "mist_start_date",
    "clean_start_date",
    "pot_start_date",
    "prune_start_date",
  ];
  let frequencyFields = [
    "water_frequency",
    "fert_frequency",
    "mist_frequency",
    "clean_frequency",
  ];

  console.log("Calling the map function on the plant data");
  Object.entries(plantData).map((item) => {
    console.log(item);
    objectKey = item[0];
    objectValue = item[1];
    console.log(objectKey);
    console.log(objectValue);

    // Perform validation on date fields
    // TODO: the water start date is not being removed after the plant is saved
    if (dateFields.indexOf(objectKey) >= 0) {
      if (objectValue === undefined || isNaN(Date.parse(objectValue))) {
        console.log(
          `Date property with value [${objectValue}] did not pass validation`
        );
        if (objectKey === "water_start_date") {
          dataIsValid = false;
        }
      } else {
        // Cannot use object.set b/c the actual objectKey variable is being stored as the key
        // We must save the key using the below method instead
        plantDataToStore[objectKey] = objectValue;
      }
      console.log("This is a date field.");
    } else if (frequencyFields.indexOf(objectKey) >= 0) {
      if (objectValue === undefined || isNaN(parseInt(objectValue))) {
        console.log(
          `Date property with value [${objectValue}] did not pass validation`
        );
        if (objectKey === "water_frequency") {
          dataIsValid = false;
        }
      } else {
        plantDataToStore[objectKey] = objectValue;
      }

      console.log("This is a frequency field");
    } else if (plantInfoFields.indexOf(objectKey) >= 0) {
      // Perform validation on plant info fields
      console.log(objectKey);
      if (objectValue === undefined || objectValue.length === 0) {
        console.log(
          `Name property with value [${objectValue}] did not pass validation`
        );
        if (objectKey === "name") {
          dataIsValid = false;
        }
      } else {
        plantDataToStore[objectKey] = objectValue;
      }
    }
  });
  plantDataToStore["owner_id"] = req.user.id;

  if (!dataIsValid) {
    // return an error status code
    res.status(400).send("Bad request. Plant was not added.");
    return;
  }
  // Add the raw plant data to the database
  // User is stored under the request

  console.log("Printing plantDataToStore");

  Object.entries(plantDataToStore).map((item) => {
    console.log(item);
    objectKey = item[0];
    objectValue = item[1];
    console.log(objectKey);
    console.log(objectValue);
  });

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
