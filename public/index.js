// Fetch locations data
async function logLocations() {
  const response = await fetch("http://localhost:4000/api/location");
  const locations = await response.json();
  return locations;
}

function closeSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.innerHTML = `<input id="pac-input" class="controls" type="text" placeholder="Search AdHubPro"/>`;
}

const sidebarFactory = (position) => {
  return `
  <input id="pac-input" class="controls" type="text" placeholder="Search AdHubPro"/>
  <div class="container px-4 mt-5">
    <div class="row mb-3 border-bottom">
      <div class="col text-center">
        <button class="nav-btn">Thông tin</button>
      </div>
      <div class="col text-center">
        <button class="nav-btn">Báo cáo</button>
      </div>
    </div>
    
    <h1 class="method">${position[0].method}</h1>
    <p>${position[0].address}</p>
    <p>${position[0].type}</p>
    <p>${position[0].ward}</p>
  </div>
`;
};

const locationInfoFactory = (results) => {
  return `<input id="pac-input" class="controls" type="text" placeholder="Search AdHubPro"/>
    <div class="alert alert-success d-flex m-4" role="alert">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-check2-circle flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
        <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z"/>
        <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z"/>
      </svg>
      <div>
        <h5> Thông tin địa điểm </h5>
        <p>
          ${results[0].formatted_address}
        </p>
        <div class="d-flex justify-content-end">
          <button type="button"
            class="btn btn-danger"
            data-bs-toggle="modal"
            data-bs-target="#feedback"> 
            Báo cáo vi phạm 
          </button> 
        </div>
    </div>
  </div>`;
};

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
    zoomControl: true,
    // Disable Type Map Control in top left
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: true,
    rotateControl: true,
    fullscreenControl: true,
  });

  // Create the search box and link it to the UI element.
  const input = document.getElementById("pac-input");
  const searchBox = new google.maps.places.SearchBox(input);
  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });

  //Listen for event fired
  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    const bounds = new google.maps.LatLngBounds();

    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }

      userMarker = new google.maps.Marker({
        position: place.geometry.location,
        map: map,
      });

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });

  // Info Window
  const infoWindow = new google.maps.InfoWindow({
    content: "",
    disableAutoPan: true,
  });

  // Reverse Geocoding
  let userMarker = null;
  map.addListener("click", function (e) {
    if (userMarker !== null) {
      const mapElement = document.getElementById("map");
      const sidebar = document.getElementById("sidebar");
      sidebar.style.backgroundColor = null;
      sidebar.innerHTML = `<input id="pac-input" class="controls" type="text" placeholder="Search AdHubPro"/>`;
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

  // Geocoding
  let geocoder = new google.maps.Geocoder();
  function geocode(request) {
    geocoder
      .geocode(request)
      .then((result) => {
        const { results } = result;
        const sidebar = document.getElementById("sidebar");
        sidebar.style.backgroundColor = "#ffffff";
        setTimeout(() => {
          sidebar.innerHTML = locationInfoFactory(results);
        }, 300);

        // const reportButton = document.getElementById("report-btn");
        // const popupElement = document.getElementById("popup");
        // reportButton.addEventListener("click", () => {
        //   popupElement.innerHTML = reportPopupFactory();
        // });

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
    marker.addListener("click", () => {
      console.log(marker.position);
      const position = locations.filter(
        (location) =>
          location.latitude === marker.position.h &&
          location.longitude === marker.position.i
      );
      const cardInfo = document.createElement("div");
      const headerInfo = document.createElement("h3");
      headerInfo.textContent = position[0].method;
      const positionInfo = document.createElement("p");
      positionInfo.textContent = position[0].type;
      const zoningStatus = document.createElement("p");
      zoningStatus.textContent = "Chưa quy hoạch";
      cardInfo.appendChild(headerInfo);
      cardInfo.appendChild(positionInfo);
      cardInfo.appendChild(zoningStatus);
      infoWindow.setContent(cardInfo);
      infoWindow.open(map, marker);

      const sidebar = document.getElementById("sidebar");
      sidebar.style.backgroundColor = "#ffffff";
      setTimeout(() => {
        sidebar.innerHTML = sidebarFactory(position);
      }, 300);
    });
    return marker;
  });

  const markerCluster = new markerClusterer.MarkerClusterer({ markers, map });

  // // Add a marker clusterer to manage the markers.
  // new MarkerClusterer({ markers, map });
}
