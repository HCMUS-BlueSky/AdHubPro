// Fetch locations data
async function logLocations() {
  const response = await fetch("http://localhost:4000/api/location");
  const locations = await response.json();
  return locations;
}

function closeSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.style.width = 0;
  sidebar.innerHTML = "";
}

async function initMap() {
  const locations = await logLocations();

  const { Map, InfoWindow } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
    "marker"
  );
  const { Places } = await google.maps.importLibrary("places");
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: { lat: 10.762993690850745, lng: 106.68247166663183 },
    mapId: "DEMO_MAP_ID",
  });
  const infoWindow = new google.maps.InfoWindow({
    content: "",
    disableAutoPan: true,
  });
  let geocoder = new google.maps.Geocoder();

  let userMarker = null;

  // Reverse Geocoding
  map.addListener("click", function (e) {
    if (userMarker !== null) {
      const mapElement = document.getElementById("map");
      const sidebar = document.getElementById("sidebar");
      sidebar.style.width = 0;
      sidebar.innerHTML = "";
      userMarker.setMap(null);
      userMarker = null;
      return;
    }
    const pos = e.latLng;
    geocode({ location: pos });
    userMarker = new google.maps.Marker({
      position: pos,
      map: map,
    });
    map.panTo(pos);
  });

  function geocode(request) {
    geocoder
      .geocode(request)
      .then((result) => {
        const { results } = result;
        const sidebar = document.getElementById("sidebar");
        setTimeout(() => {
          sidebar.innerHTML = `
                <div class="sidebar-btn" onclick="closeSidebar()">
                    <i class="bi bi-arrow-right"></i>
                </div>
                  <div class="alert alert-success d-flex m-2" role="alert">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-check2-circle flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                      <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z"/>
                      <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z"/>
                    </svg>
                    <div>
                      <h5> Thông tin địa điểm </h5>
                      <p>
                        ${results[0].formatted_address}
                      </p>
                    </div>
                  </div>`;
        }, 300);
        sidebar.style.width = "30%";

        var request = {
          query: results[0].formatted_address,
          fields: ["name", "geometry"],
        };

        var service = new google.maps.places.PlacesService(map);

        service.findPlaceFromQuery(request, function (results, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            // console.log(results);
            // for (var i = 0; i < results.length; i++) {
            //   createMarker(results[i]);
            // }
            // map.setCenter(results[0].geometry.location);
          }
        });

        return results;
      })
      .catch((e) => {
        alert("Geocode was not successful for the following reason: " + e);
      });
  }

  // Create an array of alphabetical characters used to label the markers.
  // const labels = "123456789";
  // Add some markers to the map.
  const markers = locations.map((location, i) => {
    const label = "QC";
    const position = { lat: location.latitude, lng: location.longitude };
    const pinGlyph = new google.maps.marker.PinElement({
      glyph: label,
      glyphColor: "white",
    });
    const marker = new google.maps.marker.AdvancedMarkerElement({
      position,
      content: pinGlyph.element,
      title: "Title text for the marker",
    });

    // markers can only be keyboard focusable when they have click listeners
    // open info window when marker is clicked
    marker.addListener("click", (e) => {
      console.log(e);
      const cardInfo = document.createElement("div");
      const headerInfo = document.createElement("h3");
      headerInfo.textContent = "Biểu tình Hang Pác Pó";
      const positionInfo = document.createElement("p");
      positionInfo.textContent =
        "Đất công/Công viên/Hành lang an toàn giao thông";
      const zoningStatus = document.createElement("p");
      zoningStatus.textContent = "Đã quy hoạch";
      cardInfo.appendChild(headerInfo);
      cardInfo.appendChild(positionInfo);
      cardInfo.appendChild(zoningStatus);
      infoWindow.setContent(cardInfo);
      infoWindow.open(map, marker);

      const sidebar = document.getElementById("sidebar");
      setTimeout(() => {
        sidebar.innerHTML = `
              <div class="sidebar-btn" onclick="closeSidebar()">
                  <i class="bi bi-arrow-right"></i>
              </div>
              <div class="card bg-light mb-3" style="max-width: 18rem;">
                <div class="card-header">Thông tin bảng quảng cáo</div>
                <div class="card-body">
                  <h5 class="card-title">Tra, cụm pano</h5>
                  <p class="card-text">Hello</p>
                </div>
              </div>`;
      }, 300);
      sidebar.style.width = "30%";
    });
    return marker;
  });

  const markerCluster = new markerClusterer.MarkerClusterer({ markers, map });

  // // Add a marker clusterer to manage the markers.
  // new MarkerClusterer({ markers, map });
}
