async function logLocations() {
  const response = await fetch("/api/map/locations");
  const locations = await response.json();
  return locations;
}

async function logAdsByLocation(locationID) {
  const response = await fetch(`/api/map/ads/${locationID}`);
  const ads = await response.json();
  return ads;
}

async function logReports(adsID) {
  const response = await fetch(`api/map/report/${adsID}`);
  const reports = await response.json();
  return reports;
}

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
                    <h5 class="card-title fw-bold">${ads.location.address}</h5>
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
                    <div class="d-flex justify-content-end">
                      <button type="button"
                        class="btn btn-danger"
                        data-bs-toggle="modal"
                        data-bs-target="#feedback">
                        Báo cáo vi phạm
                      </button>
                    </div>
                  </div>`;
  elm.className = "alert alert-success d-flex m-4";
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
                <h5 class="card-text">Báo cáo bởi: ${report.reporter.name}</h5>
                <h5 class="card-text">Nội dung báo cáo: ${report.content}</h5>
                <h5 class="card-text">Thời gian ghi nhận: ${moment(
                  report.created_at
                ).format("MMMM Do YYYY")}</h5>
                <h5 class="card-text">Trạng thái: ${statusLabel}</h5>
              </div>
            </div>
          `;
  elem.style = "max-width: 18rem;";
  return elem;
};

const detailCardFactory = (ads) => {
  const elem = document.createElement("div");
  elem.innerHTML = `
            <!-- Carousel -->
            <div id="demo" class="carousel slide" data-bs-ride="carousel">
  
              <!-- Indicators/dots -->
              <div class="carousel-indicators">
                <button type="button" data-bs-target="#demo" data-bs-slide-to="0" class="active"></button>
                <button type="button" data-bs-target="#demo" data-bs-slide-to="1"></button>
              </div>
              
              <!-- The slideshow/carousel -->
              <div class="carousel-inner">
                <div class="carousel-item active">
                  <img src="${
                    ads.images[0]
                  }" alt="ads-1" class="d-block" style="width:100%;">
                </div>
                <div class="carousel-item">
                  <img src="${
                    ads.images[1]
                  }" alt="ads-2" class="d-block" style="width:100%">
                </div>
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
              ).format("MMMM Do YYYY")}</p>
            </div>
          `;
  return elem;
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

function addReportLayer(map) {
  map.addLayer({
    id: "report-point",
    type: "circle",
    source: "AdsLocations",
    filter: ["==", ["get", "status"], "Đã quy hoạch"],
    paint: {
      "circle-radius": 15,
      "circle-opacity": 0,
      "circle-stroke-width": 2,
      "circle-stroke-color": "red",
    },
  });
}

function addAdsLayer(map) {
  map.addLayer({
    id: "unclustered-point",
    type: "circle",
    source: "AdsLocations",
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": "#11b4da",
      "circle-radius": 15,
    },
  });
}

function addTextLayer(map, content) {
  let filterType = [];
  if (content == "BC") {
    filterType = ["==", ["get", "status"], "Đã quy hoạch"];
  } else {
    filterType = ["!", ["has", "point_count"]];
  }
  map.addLayer({
    id: "text-point",
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
  const geojson = {
    type: "FeatureCollection",
    features: [],
  };
  locations.map((location) => {
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

    addAdsLayer(map);

    const adsSwitch = document.querySelector("#adsSwitch");
    adsSwitch.addEventListener("change", () => {
      if (adsSwitch.checked) {
        map.removeLayer("text-point");
        addAdsLayer(map);
        addTextLayer(map, "QC");
      } else {
        map.removeLayer("unclustered-point");
        map.removeLayer("text-point");
        addTextLayer(map, "BC");
      }
    });

    addReportLayer(map);

    const reportSwitch = document.querySelector("#reportSwitch");
    reportSwitch.addEventListener("change", () => {
      if (reportSwitch.checked) {
        addReportLayer(map);
      } else {
        map.removeLayer("report-point");
      }
    });

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

    map.on("click", ["unclustered-point"], (e) => {
      e.clickOnLayer = true;
    });

    map.on("mouseenter", ["unclustered-point"], (e) => {
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

    map.on("mouseleave", ["unclustered-point", "report-point"], () => {
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

  geocoder.on("result", (e) => {
    clearSidebar();
    const locationCard = locationCardFactory(e.result);
    addToSideBar(locationCard);
  });

  // Click on location
  map.on("click", ["unclustered-point", "report-point"], async (e) => {
    const features = e.features[0];
    clearSidebar();
    const adsInfo = await logAdsByLocation(features.properties._id);
    if (adsInfo.length !== 0) {
      const reportButton = document.querySelector(".report-btn");
      const infoButton = document.querySelector(".info-btn");

      reportButton.classList.remove("active");
      infoButton.classList.add("active");
      removeOutSideBar(".report-card");
      removeOutSideBar(".ads-card");
      const adsCard = AdsCardFactory(adsInfo[0]);
      addToSideBar(adsCard);

      infoButton.addEventListener("click", () => {
        infoButton.replaceWith(infoButton.cloneNode(true));
        reportButton.classList.remove("active");
        infoButton.classList.add("active");
        removeOutSideBar(".report-card");
        removeOutSideBar(".ads-card");
        const adsCard = AdsCardFactory(adsInfo[0]);
        addToSideBar(adsCard);
      });

      reportButton.addEventListener("click", async () => {
        reportButton.replaceWith(reportButton.cloneNode(true));
        infoButton.classList.remove("active");
        reportButton.classList.add("active");
        removeOutSideBar(".report-card");
        removeOutSideBar(".ads-card");
        const reportInfo = await logReports(adsInfo[0]._id);
        reportInfo.map((report) => {
          const reportCard = reportCardFactory(report);
          addToSideBar(reportCard);
        });
      });

      const detailIcon = document.querySelector(".bi-info-circle");
      detailIcon.addEventListener("click", () => {
        const infoDetailModal = document.querySelector(".modal-info-detail");
        const infoDetailCard = detailCardFactory(adsInfo[0]);
        infoDetailModal.appendChild(infoDetailCard);
      });

      const reportModal = document.querySelector(".report-modal");
      reportModal.addEventListener("submit", async (e) => {
        e.preventDefault();

        let type = "ads";
        let name = document.querySelector("#name").value;
        let email = document.querySelector("#email").value;
        let phone = document.querySelector("#phone").value;

        let method = document.querySelector(
          'input[name="method"]:checked'
        ).value;
        let content = tinymce.get("report-content").getContent();
        let location = adsInfo[0].location._id;
        let ads = adsInfo[0]._id;
        const data = new FormData();
        data.append("type", type);
        data.append("name", name);
        data.append("email", email);
        data.append("phone", phone);
        data.append("method", method);
        data.append("content", content);
        data.append("location", location);
        data.append("ads", ads);

        const fileInput = document.getElementById("file");
        for (const file of fileInput.files) {
          data.append("images", file);
        }

        try {
          const response = await fetch("api/report", {
            method: "POST",
            body: data,
          });

          if (response.ok) {
            console.log("Report submitted successfully!");
          } else {
            const errorMessage = await response.text();
            console.error("Error:", errorMessage);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      });
    }

    const sidebar = document.getElementById("sidebar");
    if (sidebar.classList.contains("collapsed")) {
      toggleSidebar();
    }
  });

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
