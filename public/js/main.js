/*------------------
  Preloader
--------------------*/

("use strict");

window.addEventListener("load", function () {
  var loader = document.querySelector(".loader");
  var preloader = document.getElementById("preloder");

  if (loader) {
    loader.style.transition = "opacity 0.5s";
    loader.style.opacity = 0;
    setTimeout(function () {
      loader.style.display = "none";
    }, 500);
  }

  if (preloader) {
    preloader.style.transition = "opacity 1s";
    preloader.style.opacity = 0;
    setTimeout(function () {
      preloader.style.display = "none";
    }, 1000);
  }
});
