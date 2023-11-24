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
