window.addEventListener("load", function () {
  // When the user form is initially accessed, the below code is executed
  let homePageForm = document.getElementById("homePageForm");
  let bannerElement = document.getElementById("banner");
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
