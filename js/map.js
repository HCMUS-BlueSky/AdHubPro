async function logLocations() {
  const response = await fetch(
    "https://cms-adhubpro.onrender.com/api/map/locations"
  );
  const locations = await response.json();
  return locations;
}

async function logAds() {
  const response = await fetch("https://cms-adhubpro.onrender.com/api/map/ads");
  const ads = await response.json();
  return ads;
}

async function logAdsByLocation(locationID) {
  const response = await fetch(
    `https://cms-adhubpro.onrender.com/api/map/ads/${locationID}`
  );
  const ads = await response.json();
  return ads;
}

async function logReports() {
  const response = await fetch(
    "https://cms-adhubpro.onrender.com/api/map/reports"
  );
  const reports = await response.json();
  return reports;
}

async function logReportsByAds(adsID) {
  const response = await fetch(
    `https://cms-adhubpro.onrender.com/api/map/report/ads/${adsID}`
  );
  const reports = await response.json();
  return reports;
}

async function logReportsByLocation(locationID) {
  const response = await fetch(
    `https://cms-adhubpro.onrender.com/api/map/report/location/${locationID}`
  );
  const reports = await response.json();
  return reports;
}

async function logReportMethod() {
  const response = await fetch(
    "https://cms-adhubpro.onrender.com/api/map/report_method"
  );
  const methods = await response.json();
  return methods;
}

async function createMethodsReport() {
  const methods = await logReportMethod();
  const reportRadio = document.querySelector(".report-radio");

  methods[0].values.forEach((method, index) => {
    const div = document.createElement("div");
    div.className = "mb-3";

    const input = document.createElement("input");
    input.type = "radio";
    input.id = `option-${index + 1}`;
    input.name = "method";
    input.value = method;

    const label = document.createElement("label");
    label.htmlFor = `option-${index + 1}`;
    label.textContent = method;

    div.appendChild(input);
    div.appendChild(label);

    reportRadio.appendChild(div);
  });
}

createMethodsReport();

mapboxgl.accessToken =
  "pk.eyJ1Ijoibm1raG9pMjEiLCJhIjoiY2xvMno5ZzhyMGQzdTJ2bGVkbTc4bGZ5dSJ9.9ljGVzjte5iqJXpbOiAN1Q";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  center: [106.68247166663183, 10.762993690850745],
  zoom: 15,
});
const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  reverseGeocode: true,
  flipCoordinates: true,
  marker: {
    color: "red",
  },
  flyTo: {
    bearing: 0,
    animate: true,
    duration: 750,
    speed: 1,
    essential: true,
    curve: 1,
    easing: function (t) {
      return Math.sin((t * Math.PI) / 2);
    },
  },
});
map.addControl(geocoder);
const sidebar = document.querySelector(".sidebar-content");
const sidebarItems = [];

let currentMarker = null;

const AdsCardFactory = (ads) => {
  const elm = document.createElement("div");
  elm.innerHTML = `
                  <div class="card-header text-center fw-bold fs-4 font-weight-bold py-3">${ads.type}</div>
                  <div class="card-body">
                    <h5 class="card-title text-muted">${ads.location.address}</h5>
                    <h5 class="card-text">Kích thước: ${ads.size}</h5>
                    <h5 class="card-text">Số lượng: ${ads.location.ads_count} trụ/bảng</h5>
                    <h5 class="card-text">Hình thức: ${ads.location.method}</h5>
                    <h5 class="card-text">Phân loại: ${ads.location.type}</h5>
                    <div class="d-flex">
                      <div class="me-auto p-2 d-flex align-items-center">
                          <i data-bs-toggle="modal" data-bs-target="#ads-detail" class="bi bi-info-circle"></i>
                      </div>
                      <div class="p-2">
                        <button type="button"
                          class="btn btn-danger"
                          data-bs-toggle="modal"
                          data-bs-target="#feedback">
                          Báo cáo vi phạm
                        </button>
                      </div>
                    </div>
                  </div>
                `;
  elm.className = "ads-card card bg-light my-3";
  elm.style = "max-width: 20rem;";
  return elm;
};

const NonAdsCardFactory = () => {
  const elem = document.createElement("div");
  elem.className = "non-ads-card alert alert-primary d-flex mx-4";
  elem.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-info-circle flex-shrink-0 me-2" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
      </svg>
      <div>
        <h5>Thông tin bảng quảng cáo</h5>
        <h5>Chưa có dữ liệu!</h5>
        <h5>Vui lòng chọn điểm trên bản đồ để xem.</h5>
      </div>
  `;
  return elem;
};

const locationCardFactory = (result) => {
  const elm = document.createElement("div");
  elm.innerHTML = `
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-check2-circle flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                    <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z"/>
                    <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z"/>
                  </svg>
                  <div>
                    <h5 class="font-weight-bold"> Thông tin địa điểm </h5>
                    <h5 class="font-weight-bold">
                      ${result.text}
                    </h5>
                    <h5>
                      ${result.place_name ? result.place_name : ""}
                    </h5>
                  </div>`;
  elm.className = "location-card alert alert-success d-flex mx-4";
  return elm;
};

const locationAdsCardFactory = (result) => {
  const elm = document.createElement("div");
  elm.innerHTML = `
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-check2-circle flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                    <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z"/>
                    <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z"/>
                  </svg>
                  <div>
                    <h5 class="font-weight-bold"> Thông tin địa điểm </h5>
                    <h5 class="font-weight-bold">
                      ${result.type}
                    </h5>
                    <h5>
                      ${result.address}
                    </h5>
                    <div class="d-flex justify-content-end">
                      <button type="button"
                        class="btn btn-danger"
                        data-bs-toggle="modal"
                        data-bs-target="#feedback">
                        Báo cáo vi phạm
                      </button>
                    </div>
                  </div>`;
  elm.className = "location-ads-card alert alert-success d-flex mx-4";
  return elm;
};

const reportCardFactory = (report) => {
  const elem = document.createElement("div");
  let statusLabel = "";
  if (report.status === "pending") {
    statusLabel = "Chờ xử lý";
    elem.className = "report-card card bg-light my-3";
  } else if (report.status == "processing") {
    statusLabel = "Đang xử lý";
    elem.className = "report-card card text-white bg-info my-3";
  } else {
    statusLabel = "Đã xử lý";
    elem.className = "report-card card text-white bg-success my-3";
  }
  elem.innerHTML = `
            <div class="card-header text-center fw-bold fs-4 font-weight-bold py-3">${
              report.method
            }</div>
              <div class="card-body">
                <h5 class="card-text">Báo cáo bởi: <b>${
                  report.reporter.name
                }</b></h5>
                <h5 class="card-text">Thời gian ghi nhận: ${moment(
                  report.created_at
                ).format("l")}</h5>
                <h5 class="card-text mb-3">Trạng thái: ${statusLabel}</h5>
                <div class="d-flex justify-content-between">
                ${
                  report.ads
                    ? '<i data-bs-toggle="modal" data-bs-target="#ads-report" class="ads-report-btn bi bi-question-circle"></i>'
                    : ""
                }                
                  <button type="button"
                    class="btn btn-primary report-detail-btn"
                    data-bs-toggle="modal"
                    data-bs-target="#report-detail">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          `;
  elem.style = "max-width: 18rem;";
  return elem;
};

const detailCardFactory = (ads) => {
  const elem = document.createElement("div");
  if (ads.expiration) {
    elem.innerHTML = `
    <!-- Carousel -->
    <div id="demo" class="carousel slide" data-bs-ride="carousel">

    <!-- Indicators/dots -->
    <div class="carousel-indicators">
      ${
        ads.images[0]
          ? '<button type="button" data-bs-target="#demo" data-bs-slide-to="0" class="active"></button>'
          : ""
      }
      ${
        ads.images[1]
          ? '<button type="button" data-bs-target="#demo" data-bs-slide-to="1"></button>'
          : ""
      }
    </div>
    
    <!-- The slideshow/carousel -->
    <div class="carousel-inner">
      ${
        ads.images[0]
          ? `
        <div class="carousel-item active">
          <img src="${ads.images[0]}" alt="ads-1" class="d-block" style="width:100%;">
        </div>`
          : ""
      }
      ${
        ads.images[1]
          ? `
        <div class="carousel-item">
          <img src="${ads.images[1]}" alt="ads-2" class="d-block" style="width:100%">
        </div>`
          : ""
      }
    </div>
      
      <!-- Left and right controls/icons -->
      <button class="carousel-control-prev" type="button" data-bs-target="#demo" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#demo" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
      </button>
    </div>
    <div class="container-fluid mt-3">
      <p class="text-center">Ngày hết hạn hợp đồng: ${moment(
        ads.expiration
      ).format("l")}</p>
    </div>
  `;
  } else {
    elem.innerHTML = "Chưa có thông tin";
  }

  return elem;
};

const reportDetailCardFactory = (report) => {
  const elem = document.createElement("div");
  elem.innerHTML = `
            <div class="container-fluid mb-3">
            <p>Nội dung báo cáo: ${report.content}</p>

            <p>Hình ảnh báo cáo: </p>
            <!-- Carousel -->
            <div id="demo" class="carousel slide" data-bs-ride="carousel">
  
            <!-- Indicators/dots -->
            <div class="carousel-indicators">
              ${
                report.images[0]
                  ? '<button type="button" data-bs-target="#demo" data-bs-slide-to="0" class="active"></button>'
                  : ""
              }
              ${
                report.images[1]
                  ? '<button type="button" data-bs-target="#demo" data-bs-slide-to="1"></button>'
                  : ""
              }
            </div>
            
            <!-- The slideshow/carousel -->
            <div class="carousel-inner">
              ${
                report.images[0]
                  ? `
                <div class="carousel-item active">
                  <img src="${report.images[0]}" alt="ads-1" class="d-block" style="width:100%;">
                </div>`
                  : ""
              }
              ${
                report.images[1]
                  ? `
                <div class="carousel-item">
                  <img src="${report.images[1]}" alt="ads-2" class="d-block" style="width:100%">
                </div>`
                  : ""
              }
            </div>
              
              <!-- Left and right controls/icons -->
              <button class="carousel-control-prev" type="button" data-bs-target="#demo" data-bs-slide="prev">
                <span class="carousel-control-prev-icon"></span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#demo" data-bs-slide="next">
                <span class="carousel-control-next-icon"></span>
              </button>
            </div>

           
          </div>
          `;
  return elem;
};

const clearReportModal = () => {
  document.querySelector("#name").value = "";
  document.querySelector("#email").value = "";
  document.querySelector("#phone").value = "";
  document.querySelector('input[name="method"]:checked').checked = false;
  tinymce.get("report-content").setContent("");
  document.querySelector("#file").value = "";
  grecaptcha.reset();
};

const handleReportModal = (typeReport, location_id, adsInfo) => {
  const reportModalButton = document.querySelector(".report-modal-btn");
  const newReportModalButton = reportModalButton.cloneNode(true);
  reportModalButton.parentNode.replaceChild(
    newReportModalButton,
    reportModalButton
  );
  newReportModalButton.addEventListener("click", async (e) => {
    e.preventDefault();

    let type = typeReport;
    let name = document.querySelector("#name").value;
    let email = document.querySelector("#email").value;
    let phone = document.querySelector("#phone").value;

    let method = document.querySelector('input[name="method"]:checked').value;
    let content = tinymce.get("report-content").getContent();
    let location = location_id;

    const data = new FormData();
    if (type == "ads") {
      data.append("type", "Bảng quảng cáo");
    } else {
      data.append("type", "Điểm đặt quảng cáo");
    }
    data.append("name", name);
    data.append("email", email);
    data.append("phone", phone);
    data.append("method", method);
    data.append("content", content);
    data.append("location", location);

    if (type == "ads") {
      let ads = adsInfo._id;
      data.append("ads", ads);
    }

    const fileInput = document.getElementById("file");
    for (const file of fileInput.files) {
      data.append("images", file);
    }

    let captchaResponse = grecaptcha.getResponse();
    if (captchaResponse.length === 0) {
      alert("Hãy xác nhận CAPTCHA.");
      return;
    }

    data.append("g-recaptcha-response", captchaResponse);

    try {
      const response = await fetch(
        "https://cms-adhubpro.onrender.com/api/map/report",
        {
          method: "POST",
          body: data,
        }
      );

      if (response.ok) {
        alert("Gửi báo cáo thành công!");
        document.querySelector("#feedback");
        clearReportModal();
      } else {
        const errorMessage = await response.text();
        alert("Lỗi: " + errorMessage);
        grecaptcha.reset();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
};

const clearSidebar = () => {
  while (sidebarItems.length) {
    sidebarItems.pop().remove();
  }
};

const addToSideBar = (elm) => {
  sidebarItems.push(elm);
  sidebar.appendChild(elm);
};

const removeOutSideBar = (className) => {
  const sidebarContent = document.querySelector(".sidebar-content");
  const elems = document.querySelectorAll(className);
  elems.forEach((el) => {
    sidebarContent.removeChild(el);
  });
};

async function addMarker(x, y) {
  if (currentMarker) {
    currentMarker.remove();
  }
  const el = document.createElement("div");
  el.className = "marker";
  currentMarker = new mapboxgl.Marker(el).setLngLat([x, y]).addTo(map);
}
// Side bar
function toggleSidebar() {
  const elem = document.getElementById("sidebar");

  const arrow = document.querySelector(".sidebar-toggle");
  arrow.classList.toggle("rotated");
  const collapsed = elem.classList.toggle("collapsed");

  map.easeTo({
    padding: collapsed ? 0 : 300,
    essential: true,
    duration: 1000, // In ms. This matches the CSS transition duration property.
  });
}

function addCustomLayer(map, type) {
  if (type == "location") {
    map.addLayer({
      id: "location-point",
      type: "circle",
      source: "AdsLocations",
      filter: [
        "all",
        ["!", ["has", "point_count"]],
        ["==", ["get", "status"], "Chưa quy hoạch"],
      ],
      paint: {
        "circle-color": "#11b4da",
        "circle-radius": 15,
      },
    });
  } else if (type == "planning") {
    map.addLayer({
      id: "planning-point",
      type: "circle",
      source: "AdsLocations",
      filter: [
        "all",
        ["!", ["has", "point_count"]],
        ["==", ["get", "status"], "Đã quy hoạch"],
      ],
      paint: {
        "circle-color": "#E26EE5",
        "circle-radius": 15,
      },
    });
  } else if (type == "report") {
    map.addLayer({
      id: "report-point",
      type: "circle",
      source: "AdsLocations",
      filter: ["==", ["get", "hasReport"], true],
      paint: {
        "circle-radius": 17,
        // "circle-opacity": 0,
        // "circle-stroke-width": 2,
        // "circle-stroke-color": "red",
        "circle-color": "red",
      },
    });
  }
}

function addTextLayer(map, content) {
  let filterType = [];
  let idType = "";
  if (content == "QC") {
    filterType = ["==", ["get", "hasAds"], true];
    idType = "text-ads-point";
  } else if (content == "BC") {
    filterType = ["==", ["get", "hasReport"], true];
    idType = "text-report-point";
  } else if (content == "ĐĐ") {
    filterType = ["==", ["get", "hasAds"], false];
    idType = "text-location-point";
  }
  map.addLayer({
    id: idType,
    type: "symbol",
    source: "AdsLocations",
    filter: filterType,
    layout: {
      "text-field": content,
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12,
    },
  });
}

async function initMap() {
  const locations = await logLocations();
  // const ads = await logAds();
  // const reports = await logReports();

  // locations.forEach((location) => {
  //   const adsInLocation = ads.find((el) => el.location === location._id);
  //   const reportInLocation = reports.find(
  //     (report) => report.location === location._id
  //   );

  //   location.hasAds = adsInLocation && adsInLocation.hasAds === undefined;
  //   location.hasReport =
  //     reportInLocation && reportInLocation.hasReport === undefined;
  // });

  const geojson = {
    type: "FeatureCollection",
    features: [],
  };
  locations.map((location) => {
    const hasAds = location.hasAds || false;
    const hasReport = location.hasReport || false;
    const feature = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [location.longitude, location.latitude],
      },
      properties: {
        _id: location._id,
        method: location.method,
        type: location.type,
        address: location.address,
        status: location.accepted ? "Đã quy hoạch" : "Chưa quy hoạch",
        hasAds: hasAds,
        hasReport: hasReport,
      },
    };
    geojson.features.push(feature);
  });

  map.on("load", () => {
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    map.addSource("AdsLocations", {
      type: "geojson",
      data: geojson,
      cluster: true,
      clusterMaxZoom: 35,
      clusterRadius: 50,
    });

    map.addLayer({
      id: "clusters",
      type: "circle",
      source: "AdsLocations",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": [
          "step",
          ["get", "point_count"],
          "#51bbd6",
          10,
          "#f1f075",
          30,
          "#f28cb1",
        ],
        "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
      },
    });

    map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "AdsLocations",
      filter: ["has", "point_count"],
      layout: {
        "text-field": ["get", "point_count_abbreviated"],
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12,
      },
    });

    addCustomLayer(map, "report");
    addCustomLayer(map, "planning");
    addCustomLayer(map, "location");

    const adsSwitch = document.querySelector("#adsSwitch");
    adsSwitch.addEventListener("change", () => {
      if (adsSwitch.checked) {
        document.querySelector(".info-btn").disabled = false;
        addCustomLayer(map, "planning");
        addCustomLayer(map, "location");
        addTextLayer(map, "ĐĐ");
        addTextLayer(map, "QC");
      } else {
        document.querySelector(".info-btn").disabled = true;
        map.removeLayer("planning-point");
        map.removeLayer("location-point");
        map.removeLayer("text-ads-point");
        map.removeLayer("text-location-point");
      }
    });

    const reportSwitch = document.querySelector("#reportSwitch");
    reportSwitch.addEventListener("change", () => {
      if (reportSwitch.checked) {
        document.querySelector(".report-btn").disabled = false;
        if (adsSwitch.checked) {
          map.removeLayer("planning-point");
          map.removeLayer("location-point");
          map.removeLayer("text-ads-point");
          map.removeLayer("text-location-point");
          addCustomLayer(map, "report");
          addCustomLayer(map, "planning");
          addCustomLayer(map, "location");
          addTextLayer(map, "BC");
          addTextLayer(map, "ĐĐ");
          addTextLayer(map, "QC");
        } else {
          addCustomLayer(map, "report");
          addTextLayer(map, "BC");
        }
      } else {
        document.querySelector(".report-btn").disabled = true;
        map.removeLayer("report-point");
        map.removeLayer("text-report-point");
      }
    });

    addTextLayer(map, "BC");
    addTextLayer(map, "ĐĐ");
    addTextLayer(map, "QC");

    map.on("click", "clusters", (e) => {
      e.clickOnLayer = true;
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["clusters"],
      });
      const clusterId = features[0].properties.cluster_id;
      map
        .getSource("AdsLocations")
        .getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;

          map.easeTo({
            center: features[0].geometry.coordinates,
            duration: 500,
            essential: true,
            zoom: zoom,
          });
        });
    });

    map.on(
      "click",
      ["location-point", "planning-point", "report-point"],
      (e) => {
        e.clickOnLayer = true;
      }
    );

    map.on("mouseenter", ["location-point", "planning-point"], (e) => {
      map.getCanvas().style.cursor = "pointer";
      const coordinates = e.features[0].geometry.coordinates.slice();

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      popup
        .setLngLat(coordinates)
        .setHTML(
          `<h6 class="fw-bold">${e.features[0].properties.method}</h6>
                    <p>${e.features[0].properties.type}</p>
                    <p>${e.features[0].properties.address}</p>
                    <h5 class="fw-bold fst-italic text-uppercase">${e.features[0].properties.status}</h5>`
        )
        .addTo(map);
    });

    map.on("mouseenter", ["report-point"], () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", ["location-point", "planning-point"], () => {
      map.getCanvas().style.cursor = "";
      popup.remove();
    });

    map.on("mouseenter", "clusters", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "clusters", () => {
      map.getCanvas().style.cursor = "";
    });

    // Reverse geocoding
    map.on("click", (e) => {
      if (e.clickOnLayer) {
        return;
      }
      let m = e.lngLat.wrap();
      geocoder.query(`${m.lng}, ${m.lat}`);
    });
  });

  // Random locations
  geocoder.on("result", async (e) => {
    clearSidebar();

    const reportButton = document.querySelector(".report-btn");
    const infoButton = document.querySelector(".info-btn");

    reportButton.classList.remove("active");
    infoButton.classList.add("active");
    removeOutSideBar(".report-card");
    removeOutSideBar(".location-card");
    removeOutSideBar(".non-ads-card");
    const nonAdsCard = NonAdsCardFactory();
    addToSideBar(nonAdsCard);
    const locationCard = locationCardFactory(e.result);
    addToSideBar(locationCard);

    const newInfoButton = infoButton.cloneNode(true);
    infoButton.parentNode.replaceChild(newInfoButton, infoButton);
    newInfoButton.addEventListener("click", async () => {
      newReportButton.classList.remove("active");
      newInfoButton.classList.add("active");
      removeOutSideBar(".report-card");
      removeOutSideBar(".location-card");
      removeOutSideBar(".non-ads-card");
      const nonAdsCard = NonAdsCardFactory();
      addToSideBar(nonAdsCard);
      const locationCard = locationCardFactory(e.result);
      addToSideBar(locationCard);
    });

    const newReportButton = reportButton.cloneNode(true);
    reportButton.parentNode.replaceChild(newReportButton, reportButton);

    newReportButton.addEventListener("click", async () => {
      newInfoButton.classList.remove("active");
      newReportButton.classList.add("active");
      removeOutSideBar(".report-card");
      removeOutSideBar(".location-card");
      removeOutSideBar(".non-ads-card");
    });

    const sidebar = document.getElementById("sidebar");
    if (sidebar.classList.contains("collapsed")) {
      toggleSidebar();
    }
  });

  // Click on location or ads
  map.on(
    "click",
    ["location-point", "planning-point", "report-point"],
    async (e) => {
      const features = e.features[0];
      clearSidebar();
      const adsInfo = await logAdsByLocation(features.properties._id);
      const reportButton = document.querySelector(".report-btn");
      const infoButton = document.querySelector(".info-btn");

      if (adsInfo.length !== 0) {
        const adsSwitch = document.querySelector("#adsSwitch");
        reportButton.classList.remove("active");
        infoButton.classList.add("active");
        removeOutSideBar(".report-card");
        removeOutSideBar(".ads-card");
        if (adsSwitch.checked) {
          adsInfo.forEach((el) => {
            let adsCard = AdsCardFactory(el);
            addToSideBar(adsCard);
          });
        }

        const newInfoButton = infoButton.cloneNode(true);
        infoButton.parentNode.replaceChild(newInfoButton, infoButton);
        newInfoButton.addEventListener("click", async () => {
          newReportButton.classList.remove("active");
          newInfoButton.classList.add("active");
          removeOutSideBar(".report-card");
          removeOutSideBar(".ads-card");
          adsInfo.forEach((el) => {
            let adsCard = AdsCardFactory(el);
            addToSideBar(adsCard);
          });
          const detailIcons = document.querySelectorAll(".bi-info-circle");

          const reportButtons = document.querySelectorAll(
            ".ads-card .btn-danger"
          );

          reportButtons.forEach((button, index) => {
            button.addEventListener("click", () => {
              handleReportModal(
                "ads",
                adsInfo[index].location._id,
                adsInfo[index]
              );
            });
          });

          detailIcons.forEach((detail, index) => {
            detail.addEventListener("click", () => {
              const infoDetailModal =
                document.querySelector(".modal-info-detail");
              infoDetailModal.innerHTML = "";
              const infoDetailCard = detailCardFactory(adsInfo[index]);
              infoDetailModal.appendChild(infoDetailCard);
            });
          });
        });

        const reportButtons = document.querySelectorAll(
          ".ads-card .btn-danger"
        );

        reportButtons.forEach((button, index) => {
          button.addEventListener("click", () => {
            handleReportModal(
              "ads",
              adsInfo[index].location._id,
              adsInfo[index]
            );
          });
        });

        const newReportButton = reportButton.cloneNode(true);
        reportButton.parentNode.replaceChild(newReportButton, reportButton);

        newReportButton.addEventListener("click", async () => {
          newInfoButton.classList.remove("active");
          newReportButton.classList.add("active");
          removeOutSideBar(".report-card");
          removeOutSideBar(".ads-card");
          const reportInfoArray = await Promise.all(
            adsInfo.map(async (ads) => {
              return await logReportsByAds(ads._id);
            })
          );
          const reportInfoArrayFlat = reportInfoArray.flat();
          reportInfoArrayFlat.forEach((report) => {
            const reportCard = reportCardFactory(report);
            addToSideBar(reportCard);
          });

          // Report Detail
          const reportDetailBtn =
            document.querySelectorAll(".report-detail-btn");
          reportDetailBtn.forEach((detail, index) => {
            detail.addEventListener("click", () => {
              const reportDetailModal = document.querySelector(
                ".modal-report-detail"
              );
              reportDetailModal.innerHTML = "";
              const reportDetailCard = reportDetailCardFactory(
                reportInfoArrayFlat[index]
              );
              reportDetailModal.appendChild(reportDetailCard);
            });
          });

          const adsReportBtn = document.querySelectorAll(".ads-report-btn");
          adsReportBtn.forEach((detail, index) => {
            detail.addEventListener("click", () => {
              const adsReportModal =
                document.querySelector(".modal-ads-report");
              adsReportModal.innerHTML = "";
              const adsDetailCard = detailCardFactory(
                reportInfoArrayFlat[index].ads
              );
              adsReportModal.appendChild(adsDetailCard);
            });
          });
        });

        const detailIcons = document.querySelectorAll(".bi-info-circle");
        detailIcons.forEach((detail, index) => {
          detail.addEventListener("click", () => {
            const infoDetailModal =
              document.querySelector(".modal-info-detail");
            infoDetailModal.innerHTML = "";
            const infoDetailCard = detailCardFactory(adsInfo[index]);
            infoDetailModal.appendChild(infoDetailCard);
          });
        });
      } else {
        const adsSwitch = document.querySelector("#adsSwitch");
        if (adsSwitch.checked) {
          const locationAdsCard = locationAdsCardFactory(features.properties);
          addToSideBar(locationAdsCard);
          const nonAdsCard = NonAdsCardFactory();
          addToSideBar(nonAdsCard);
        }
        reportButton.classList.remove("active");
        infoButton.classList.add("active");

        const newInfoButton = infoButton.cloneNode(true);
        infoButton.parentNode.replaceChild(newInfoButton, infoButton);
        newInfoButton.addEventListener("click", async () => {
          newReportButton.classList.remove("active");
          newInfoButton.classList.add("active");
          removeOutSideBar(".report-card");
          removeOutSideBar(".non-ads-card");
          removeOutSideBar(".location-ads-card");
          const locationAdsCard = locationAdsCardFactory(features.properties);
          addToSideBar(locationAdsCard);
          const nonAdsCard = NonAdsCardFactory();
          addToSideBar(nonAdsCard);
        });

        const newReportButton = reportButton.cloneNode(true);
        reportButton.parentNode.replaceChild(newReportButton, reportButton);

        newReportButton.addEventListener("click", async () => {
          newInfoButton.classList.remove("active");
          newReportButton.classList.add("active");
          removeOutSideBar(".report-card");
          removeOutSideBar(".non-ads-card");
          removeOutSideBar(".location-ads-card");
          const reportInfo = await logReportsByLocation(
            features.properties._id
          );
          reportInfo.map((report) => {
            const reportCard = reportCardFactory(report);
            addToSideBar(reportCard);
          });

          // Report Detail
          const reportDetailBtn =
            document.querySelectorAll(".report-detail-btn");
          reportDetailBtn.forEach((detail, index) => {
            detail.addEventListener("click", () => {
              const reportDetailModal = document.querySelector(
                ".modal-report-detail"
              );
              reportDetailModal.innerHTML = "";
              const reportDetailCard = reportDetailCardFactory(
                reportInfo[index]
              );
              reportDetailModal.appendChild(reportDetailCard);
            });
          });
        });

        handleReportModal("location", features.properties._id, null);
      }

      const sidebar = document.getElementById("sidebar");
      if (sidebar.classList.contains("collapsed")) {
        toggleSidebar();
      }
    }
  );

  // Add geolocate control to the map.
  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      // When active the map will receive updates to the device's location as it changes.
      trackUserLocation: true,
      // Draw an arrow next to the location dot to indicate which direction the device is heading.
      showUserHeading: true,
    })
  );

  // Add zoom and rotation controls to the map.
  map.addControl(new mapboxgl.NavigationControl());
}

initMap();
