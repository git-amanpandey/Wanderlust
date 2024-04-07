mapboxgl.accessToken = mapToken;
let myCoordinates= JSON.parse(myCoordinate);

const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v9",
  center: myCoordinates, // starting position [lng, lat]
  zoom: 10, // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.ScaleControl());

const layerList = document.getElementById('menu');
const inputs = layerList.getElementsByTagName('input');

for (const input of inputs) {
    input.onclick = (layer) => {
        const layerId = layer.target.id;
        map.setStyle('mapbox://styles/mapbox/' + layerId);
    }
  };

const popup = new mapboxgl.Popup({ offset: 25 }).setText(
    `This Listing is exact here,at longitude:${myCoordinates[1]} and latitude: ${myCoordinates[0]}.`
);
// console.log(myCoordinates);
const marker1 = new mapboxgl.Marker({ color: 'red', url:'https://icons8.com/icon/80319/home' })
                .setLngLat(myCoordinates)
                .setPopup(popup)
                .addTo(map);