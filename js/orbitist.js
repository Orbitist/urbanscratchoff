var mapId = 1596; // ENTER YOUR ORBITIST MAP NUMBER HERE

// Get Orbitist Points //
var orbitistGeoJson = (function () {
    var orbitistGeoJson = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': 'https://app.orbitist.com/api/v1/geojson/' +  mapId + '.json',
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return orbitistGeoJson;
})();

// ADVANCED: This tells the map what goes in popups.
function orbitistPopup(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.name) {
        layer.bindPopup(feature.properties.description, {closeButton: false});
    }
}

// Set cluster variables
var markers = L.markerClusterGroup({maxClusterRadius: 25, disableClusteringAtZoom: 17});

// Add markers to map based on geojson
var geoJsonLayer = L.geoJson(orbitistGeoJson, {
	pointToLayer: function(feature, latlng) {
	   var smallIcon = L.divIcon({
className: feature.properties.mapPointIconClass,
iconSize: [30, 30],
iconAnchor: [15, 30],
popupAnchor: [0, -28]
	   });
	   return L.marker(latlng, {icon: smallIcon});
	},
    onEachFeature: orbitistPopup
});

markers.addLayer(geoJsonLayer);
map.addLayer(markers);
map.fitBounds(markers.getBounds());

// Deal with twitter script fires
		window.setInterval(function(){
			twttr.widgets.load()
		}, 500);