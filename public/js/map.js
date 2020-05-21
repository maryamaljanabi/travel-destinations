mapboxgl.accessToken =
  "pk.eyJ1IjoibS0xMzVhIiwiYSI6ImNrOGs0azhxazAxdnkzbW41YmMzbzVlMWEifQ.G3TjkNTo2ds1vymT0wg5rg";
var lat = document.getElementById("lat").innerText;
var lng = document.getElementById("lng").innerText;

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  zoom: 8,
  center: [lng, lat],
});

var marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
