function disableButton(boolVal) {
  // Disables the "create" button on the add user form
  document.getElementById("login_button").disabled = boolVal;
}

window.addEventListener("load", function () {
  // When the user form is initially accessed, the below code is executed
  let loginUserForm = document.getElementById("userLoginForm");
  let bannerElement = document.getElementById("banner");

  loginUserForm.addEventListener("submit", function (event) {
    //   The default submit will refresh the page. This has been disabled
    event.preventDefault();
    // Disable the button so that the request is sent once.
    // Prevents the user from sending multiple requests at the same time
    disableButton(true);

    let email = document.getElementById("email");
    let password = document.getElementById("password");

    // The string will be securely transmitted to the server. Only true for https
    let userData = {
      email: email.value,
      password: password.value,
    };

    // Post the data to the server. The server stores the data in the db after validation~
    // Get requests do not have a body. Put/Post requests have a body
    fetch("/login", {
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
          bannerElement.innerText = "ERROR: could not login user.";
          console.error(response);
        } else if (response.status === 200) {
          // bannerElement.innerText = "SUCCESS: was logged in.";
          // Clear the login data
          // (email.value = ""), (password.value = "");
          console.log(response);
          // Redirect to home page from the client. You can also do this from the server
          window.location.href = "/home";
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
