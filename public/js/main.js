/*------------------
  Preloader
--------------------*/

("use strict");

function queryPage(event) {
  event.preventDefault();
  let params = new URL(document.location).searchParams;
  params.set("page", event.target.getAttribute("href"));
  document.location.assign(
    window.location.origin + window.location.pathname + "?" + params.toString()
  );
}

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

const showAddWardModal = (btn) => {
  document.querySelector("#selected-district").value =
    btn.dataset.selectedDistrict;
  document.querySelector("#selected-district-id").value =
    btn.dataset.selectedDistrictId;
};

const showDeleteWardModal = (btn) => {
  const wardSelect = document.querySelector(".wardsDelete");
  wardSelect.innerHTML = "";
  btn.dataset.selectedWardList.split(",").forEach((ward) => {
    let option = document.createElement("option");
    option.value = ward;
    option.innerHTML = ward;
    wardSelect.appendChild(option);
  });
};
