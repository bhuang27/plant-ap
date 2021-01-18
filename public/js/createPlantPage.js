function disableButton(boolVal) {
  // Disables the "create" button on the add plant form
  document.getElementById("create_button").disabled = boolVal;
}

window.addEventListener("load", function () {
  // When the plant form is initially accessed, the below code is executed
  let createPlantForm = document.getElementById("createPlantForm");
  let bannerElement = document.getElementById("banner");

  createPlantForm.addEventListener("submit", function (event) {
    //   The default submit will refresh the page. This has been disabled
    event.preventDefault();
    // Disable the button so that the request is sent once.
    // Prevents the user from sending multiple requests at the same time
    disableButton(true);

    let plantName = document.getElementById("name");
    let speciesName = document.getElementById("species_name");
    let description = document.getElementById("description");
    let frequency = document.getElementById("frequency");
    let startDate = document.getElementById("start_date");

    let plantData = {
      name: plantName.value,
      species_name: speciesName.value,
      description: description.value,
      frequency: frequency.value,
      start_date: startDate.value,
    };

    // Post the data to the server. The server stores the data in the db after validation~
    fetch("/plant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(plantData),
    })
      .then((response) => {
        // If response from server is 400, display error
        if (response.status === 400) {
          // Update banner with error message
          bannerElement.innerText = "ERROR: could not create plant.";
          console.error(response);
        } else if (response.status === 201) {
          bannerElement.innerText = "SUCCESS: plant was created.";
          plantName.value = "";
          speciesName.value = "";
          description.value = "";
          frequency.value = "";
          startDate.value = "";
        } else {
          bannerElement.innerText = "An unexpected error occurred.";
        }
        // Re-enable the button after the response is returned
        disableButton(false);
      })
      .catch((err) => {
        console.log(err);
        disableButton(false);
      });
  });
});
