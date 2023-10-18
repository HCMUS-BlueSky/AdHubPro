import { MarkerClusterer } from "@googlemaps/markerclusterer";


async function initMap() {
  // Request needed libraries.
  const { Map, InfoWindow } = await google.maps.importLibrary('maps');
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
    'marker'
  );
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: { lat: 10.762993690850745, lng: 106.68247166663183 },
    mapId: 'DEMO_MAP_ID'
  });
  const infoWindow = new google.maps.InfoWindow({
    content: '',
    disableAutoPan: true
  });

  let userMarker = null

  // Reverse Geocoding
  map.addListener('click', function (e) {
    if(userMarker !== null) {
      const mapElem = document.getElementById('map');
      mapElem.style.width = '100%';
      userMarker.setMap(null);
      userMarker = null;
      return;
    }
    const pos = e.latLng;
    console.log(JSON.stringify(pos));
    userMarker = new google.maps.Marker({
      position: pos,
      map: map
    });
    map.panTo(pos);
    setTimeout(() => {
      const mapElem = document.getElementById('map');
      mapElem.style.width = '80%';
    }, 300);
    
  });

  // Create an array of alphabetical characters used to label the markers.
  const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  // Add some markers to the map.
  const markers = locations.map((position, i) => {
    const label = labels[i % labels.length];
    const pinGlyph = new google.maps.marker.PinElement({
      glyph: label,
      glyphColor: 'white'
    });
    const marker = new google.maps.marker.AdvancedMarkerElement({
      position,
      content: pinGlyph.element
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

      const mapElem = document.getElementById('map');
      mapElem.style.width = "80%";
    });
    return marker;
  });

  // Add a marker clusterer to manage the markers.
  new MarkerClusterer({ markers, map });
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
];

initMap();
