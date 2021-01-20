function disableButton(boolVal) {
  // Disables the "create" button on the add user form
  document.getElementById("signup_button").disabled = boolVal;
}

window.addEventListener("load", function () {
  // When the user form is initially accessed, the below code is executed
  let createUserForm = document.getElementById("userSignupForm");
  let bannerElement = document.getElementById("banner");

  createUserForm.addEventListener("submit", function (event) {
    //   The default submit will refresh the page. This has been disabled
    event.preventDefault();
    // Disable the button so that the request is sent once.
    // Prevents the user from sending multiple requests at the same time
    disableButton(true);

    let email = document.getElementById("email");
    let password = document.getElementById("password");

    let userData = {
      email: email.value,
      password: password.value,
    };

    // Post the data to the server. The server stores the data in the db after validation~
    fetch("/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        // If response from server is 400, display error
        if (response.status === 400) {
          // Update banner with error message
          bannerElement.innerText = "ERROR: could not create user.";
          console.error(response);
        } else if (response.status === 201) {
          bannerElement.innerText = "SUCCESS: user was created.";
          email.value = "";
          password.value = "";
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
