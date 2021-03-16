function disableButton(boolVal) {
  // Disables the "create" button on the add plant form
  document.getElementById("create_button").disabled = boolVal;
}

window.addEventListener("load", function () {
  // When the plant form is initially accessed, the below code is executed
  let createPlantForm = document.getElementById("createPlantForm");
  let bannerElement = document.getElementById("banner");

  // Everything added below is to the same div, "container"
  // TODO: update so they are in separate divs?
  document.getElementById("add-task").onclick = function () {
    var values = [
      "water",
      "mist",
      "fertilize",
      "re-pot",
      "clean leaves",
      "prune",
    ];

    var select = document.createElement("select");
    select.name = "new-task";
    select.id = "new-task";

    for (const val of values) {
      var option = document.createElement("option");
      option.value = val;
      option.text = val.charAt(0).toUpperCase() + val.slice(1);
      select.appendChild(option);
    }
    // TODO: fix the line breaks
    linebreak0 = document.createElement("BR");
    linebreak1 = document.createElement("BR");
    linebreak2 = document.createElement("BR");
    linebreak3 = document.createElement("BR");
    // option.appendChild(linebreak);

    var label = document.createElement("label");
    label.innerHTML = "Additional task: ";
    label.htmlFor = "new-task";

    // TODO: loop through task, frequency and start date to create nodes
    // TODO: assign numbers to each task section added
    // Frequency
    var frequencyHTML = document.createElement("input");
    frequencyHTML.setAttribute("type", "number");
    frequencyHTML.name = "frequency";
    frequencyHTML.id = "frequency";
    var freqLabel = document.createElement("label");
    freqLabel.innerHTML = "Frequency (days): ";
    freqLabel.htmlFor = "frequency";

    // Start date
    var dateHTML = document.createElement("input", {
      name: "start_date",
      id: "start_date",
    });
    dateHTML.setAttribute("type", "date");
    var dateLabel = document.createElement("label");
    dateLabel.innerHTML = "Start date: ";
    dateLabel.htmlFor = "start_date";

    var parent = document.getElementById("container");
    // Append task
    parent.appendChild(linebreak0);
    parent.appendChild(label).appendChild(select);
    parent.appendChild(linebreak1);

    // Append frequency
    parent.appendChild(freqLabel).appendChild(frequencyHTML);
    parent.appendChild(linebreak2);

    // Append start date
    parent.appendChild(dateLabel).appendChild(dateHTML);
    parent.appendChild(linebreak3);
  };

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
