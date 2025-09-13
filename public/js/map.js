mapboxgl.accessToken = mapToken;

// Ensure coordinates is an array of numbers
console.log("Coordinates:", coordinates, typeof coordinates);

const map = new mapboxgl.Map({
  container: 'map',
  center: coordinates,   // must be [lng, lat]
  zoom: 9
});

const marker=new mapboxgl.Marker({color:"red"})
  .setLngLat(coordinates)
  .setPopup(new mapboxgl.Popup({offset: 25})
    .setHTML("<h3>Exact Location</h3>"))

  .addTo(map);
