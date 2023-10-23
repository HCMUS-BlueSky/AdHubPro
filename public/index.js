async function initMap() {
  const { Map, InfoWindow } = await google.maps.importLibrary('maps');
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
    'marker'
  );
  const { Places } = await google.maps.importLibrary('places');
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: { lat: 10.762993690850745, lng: 106.68247166663183 },
    mapId: 'DEMO_MAP_ID'
  });
  const infoWindow = new google.maps.InfoWindow({
    content: '',
    disableAutoPan: true
  });
  let geocoder = new google.maps.Geocoder();

  let userMarker = null;

  // Reverse Geocoding
  map.addListener('click', function (e) {
    if (userMarker !== null) {
      const mapElement = document.getElementById('map');
      const sidebar = document.getElementById('sidebar');
      sidebar.style.width = 0;
      sidebar.innerHTML = '';
      userMarker.setMap(null);
      userMarker = null;
      return;
    }
    const pos = e.latLng;
    geocode({ location: pos });
    // console.log(JSON.stringify(pos));
    userMarker = new google.maps.Marker({
      position: pos,
      map: map
    });
    map.panTo(pos);
  });

  function geocode(request) {
    geocoder
      .geocode(request)
      .then((result) => {
        const { results } = result;
        // console.log(results);
        const sidebar = document.getElementById('sidebar');
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
        sidebar.style.width = '30%';

        var request = {
          query: results[0].formatted_address,
          fields: ['name', 'geometry']
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
        alert('Geocode was not successful for the following reason: ' + e);
      });
  }

  // Create an array of alphabetical characters used to label the markers.
  // const labels = "123456789";
  // Add some markers to the map.
  const markers = locations.map((position, i) => {
    const label = 'QC';
    const pinGlyph = new google.maps.marker.PinElement({
      glyph: label,
      glyphColor: 'white'
    });
    const marker = new google.maps.marker.AdvancedMarkerElement({
      position,
      content: pinGlyph.element,
      title: 'Title text for the marker'
    });

    // markers can only be keyboard focusable when they have click listeners
    // open info window when marker is clicked
    marker.addListener('click', () => {
      const cardInfo = document.createElement('div');
      const headerInfo = document.createElement('h3');
      headerInfo.textContent = 'Biểu tình Hang Pác Pó';
      const positionInfo = document.createElement('p');
      positionInfo.textContent =
        'Đất công/Công viên/Hành lang an toàn giao thông';
      const zoningStatus = document.createElement('p');
      zoningStatus.textContent = 'Đã quy hoạch';
      cardInfo.appendChild(headerInfo);
      cardInfo.appendChild(positionInfo);
      cardInfo.appendChild(zoningStatus);
      infoWindow.setContent(cardInfo);
      infoWindow.open(map, marker);

      const sidebar = document.getElementById('sidebar');
      setTimeout(() => {
        sidebar.innerHTML = `
              <div class="sidebar-btn" onclick="closeSidebar()">
                  <i class="bi bi-arrow-right"></i>
              </div>
              <div class="alert alert-primary d-flex align-items-center m-2" role="alert">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
                <div>
                  Thông tin bảng quảng cáo
                </div>
              </div>`;
      }, 300);
      sidebar.style.width = '30%';
    });
    return marker;
  });

  const markerCluster = new markerClusterer.MarkerClusterer({ markers, map });

  // // Add a marker clusterer to manage the markers.
  // new MarkerClusterer({ markers, map });
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.style.width = 0;
  sidebar.innerHTML = '';
}

const locations = [
  { lat: 10.762993690850745, lng: 106.68247166663183 },
  { lat: 10.763747306708495, lng: 106.68255749732144 },
  { lat: 10.758647557139085, lng: 106.6817497288846 },
  { lat: 10.76478718852813, lng: 106.67819311972303 },
  { lat: 10.76837842784627, lng: 106.67832310249808 },
  { lat: 10.773210602249506, lng: 106.67757225283157 },
  { lat: 10.758482424489724, lng: 106.66913182163469 },
  { lat: 10.760088951620775, lng: 106.66893485629518 },
  { lat: 10.757388868984554, lng: 106.67392016485842 },
  { lat: 10.756727335688439, lng: 106.6852083026225 },
  { lat: 10.767741590813353, lng: 106.67477588068961 },
  { lat: 10.757143381322711, lng: 106.67823121034714 },
  { lat: 10.755561318767807, lng: 106.68144541698122 },
  { lat: 10.757868, lng: 106.689743 },
  { lat: 10.768549, lng: 106.689913 },
  { lat: 10.756503, lng: 106.685001 },
  { lat: 10.756708, lng: 106.685207 },
  { lat: 10.754889, lng: 106.667199 },
  { lat: 10.771504, lng: 106.692947 },
  { lat: 10.768866, lng: 106.689193 },
  { lat: 10.767618, lng: 106.679826 },
  { lat: 10.767383, lng: 106.693982 },
  { lat: 10.761071, lng: 106.668448 },
  { lat: 10.760629, lng: 106.688597 },
  { lat: 10.7722534, lng: 106.698366 },
  { lat: 10.774835, lng: 106.692735 },
  { lat: 10.776686, lng: 106.694861 },
  { lat: 10.779161, lng: 106.692386 },
  { lat: 10.774014, lng: 106.690148 },
  { lat: 10.773814, lng: 106.689421 },
  { lat: 10.767889, lng: 106.674735 },
  { lat: 10.76806, lng: 106.674406 },
  { lat: 10.765816, lng: 106.681558 },
  { lat: 10.766926, lng: 106.676044 },
  { lat: 10.773571, lng: 106.689043 },
  { lat: 10.768532, lng: 106.683994 },
  { lat: 10.767454, lng: 106.686392 },
  { lat: 10.766534, lng: 106.688275 },
  { lat: 10.75939, lng: 106.684167 },
  { lat: 10.756287, lng: 106.685117 },
  { lat: 10.755891, lng: 106.683859 },
  { lat: 10.757464, lng: 106.674281 },
  { lat: 10.757906, lng: 106.67221 },
  { lat: 10.756104, lng: 106.666262 },
  { lat: 10.768222, lng: 106.673732 },
  { lat: 10.759748, lng: 106.669303 },
  { lat: 10.761248, lng: 106.677239 },
  { lat: 10.758683, lng: 106.677922 },
  { lat: 10.761242, lng: 106.683093 },
  { lat: 10.765107, lng: 106.681336 }
];
