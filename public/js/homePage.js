function disableButton(boolVal) {
  // Disables the "create" button on the add user form
  document.getElementById("logout_button").disabled = boolVal;
}

// const logout = document.querySelector("#logout_button");
// logout.addEventListener("submit", (e) => {
//   e.preventDefault();
//   disableButton(true);
//   document.cookie = "cookiename= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
//   console.log(document.cookie);
//   // TODO disable back button
//   window.location.href = "/login";
// });

window.addEventListener("load", function () {
  // When the user form is initially accessed, the below code is executed
  let homePageForm = document.getElementById("homePageForm");
  let logout = document.getElementById("logout_button");
  let bannerElement = document.getElementById("banner");

  //   fetch("/plant", {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then((response) => {
  //       return response.json();
  //       //   if (response.status === 400) {
  //       //     bannerElement.innerText = "ERROR: could not display user's plants.";
  //       //   } else if (response.status === 200) {
  //       //     console.log(response);
  //       //     //   console.log(body);
  //       //   } else {
  //       //     bannerElement.innerText = "An unexpected error occurred.";
  //       //   }
  //     })
  //     .then((plantData) => console.log(plantData))
  //     .catch((err) => {
  //       console.log(err);
  //     });

  logout.addEventListener("click", function (event) {
    event.preventDefault();
    disableButton(true);
    document.cookie = "auth_token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";

    // Post the data to the server. The server stores the data in the db after validation~
    // Get requests do not have a body. Put/Post requests have a body
    // The fetch below initiates the switch to the login page but window.location.href ultimately chanes the route
    fetch("/login", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      //   body: JSON.stringify(userData),
    })
      .then((response) => {
        // If response from server is 400, display error
        if (response.status === 400) {
          // Update banner with error message
          bannerElement.innerText = "ERROR: could not logout user.";
          console.error(response);
        } else if (response.status === 200) {
          console.log(response);
          // Redirect to home page from the client. You can also do this from the server
          window.location.href = "/login";
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

/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function highlightPage() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}
