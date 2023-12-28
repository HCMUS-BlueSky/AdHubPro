async function logLocations() {
  const response = await fetch("/api/location");
  const locations = await response.json();
  return locations;
}

async function logAdsByLocation(locationID) {
  const response = await fetch(`/api/map/ads/${locationID}`);
  const ads = await response.json();
  return ads;
}

async function logReports(adsID) {
  const response = await fetch(`api/map/report/ads/${adsID}`);
  const reports = await response.json();
  return reports;
}

async function logReportsByLocation(locationID) {
  const response = await fetch(`api/map/report/location/${locationID}`);
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
                <h5 class="card-text">Báo cáo bởi: ${report.reporter.name}</h5>
                <h5 class="card-text">Nội dung báo cáo: ${report.content}</h5>
                <h5 class="card-text">Thời gian ghi nhận: ${moment(
                  report.created_at
                ).format("DD/MM/YYYY")}</h5>
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

const clearReportModal = () => {
  document.querySelector("#name").value = "";
  document.querySelector("#email").value = "";
  document.querySelector("#phone").value = "";
  document.querySelector('input[name="method"]:checked').value = "";
  // tinymce.get("report-content").getContent() = "";
  document.getElementById("file").value = "";
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

  // Click on location
  map.on("click", ["unclustered-point", "report-point"], async (e) => {
    const features = e.features[0];
    clearSidebar();
    const adsInfo = await logAdsByLocation(features.properties._id);
    const reportButton = document.querySelector(".report-btn");
    const infoButton = document.querySelector(".info-btn");

    if (adsInfo.length !== 0) {
      reportButton.classList.remove("active");
      infoButton.classList.add("active");
      removeOutSideBar(".report-card");
      removeOutSideBar(".ads-card");
      adsInfo.forEach((el) => {
        let adsCard = AdsCardFactory(el);
        addToSideBar(adsCard);
      });

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
            return await logReports(ads._id);
          })
        );
        const reportInfoArrayFlat = reportInfoArray.flat();
        reportInfoArrayFlat.forEach((report) => {
          const reportCard = reportCardFactory(report);
          addToSideBar(reportCard);
        });
      });

      const detailIcons = document.querySelectorAll(".bi-info-circle");
      detailIcons.forEach((detail, index) => {
        detail.addEventListener("click", () => {
          const infoDetailModal = document.querySelector(".modal-info-detail");
          infoDetailModal.innerHTML = "";
          const infoDetailCard = detailCardFactory(adsInfo[index]);
          infoDetailModal.appendChild(infoDetailCard);
        });
      });
    } else {
      const locationAdsCard = locationAdsCardFactory(features.properties);
      addToSideBar(locationAdsCard);
      const nonAdsCard = NonAdsCardFactory();
      addToSideBar(nonAdsCard);
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
        const reportInfo = await logReportsByLocation(features.properties._id);
        reportInfo.map((report) => {
          const reportCard = reportCardFactory(report);
          addToSideBar(reportCard);
        });
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
