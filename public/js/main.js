const handleUserMenu = () => {
  const menu = document.querySelector(".menu");

  if (menu) {
    menu.remove();
  } else {
    const elm = document.createElement("div");
    elm.innerHTML = `
      <div class="info">
          <h3>Nguyen Khoi</h3>
          <p>nminhkhoi0818@gmail.com</p>
      </div>
      <div class="logout">
          <a>Log out</a>
      </div>
    `;
    elm.className = "menu";
    document.querySelector(".menu-user").appendChild(elm);
  }
};

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
