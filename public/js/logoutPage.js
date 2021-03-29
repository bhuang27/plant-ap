window.addEventListener("load", function () {
  let homePageForm = document.getElementById("userLogoutForm");
  document.cookie = "auth_token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  fetch("/login", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      // If response from server is 400, display error
      if (res.status === 400) {
        // Update banner with error message
        //bannerElement.innerText = "ERROR: could not logout user.";
        console.error(res);
      } else if (res.status === 200) {
        console.log(res);
        // Redirect to home page from the client. You can also do this from the server
        window.location.href = "/login";
        res.status(200).cookie("auth_token", "").send();
      } else {
        //bannerElement.innerText = "An unexpected error occurred.";
      }
    })
    .catch((err) => {
      console.log(err);
    });

  //   function preventBack() {
  //     window.history.forward();
  //   }
  //   setTimeout("preventBack()", 0);
  //   window.onunload = function () {
  //     null;
  //   };
});
