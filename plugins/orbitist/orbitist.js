// add ORBITIST POI
	var mapId = 1596;

	// Get points //
	var json = (function () {
			var json = null;
			$.ajax({
					'async': false,
					'global': false,
					'url': 'https://app.orbitist.com/api/v1/geojson/' +  mapId + '.json',
					'dataType': "json",
					'success': function (data) {
							json = data;
					}
			});
			return json;
	})(); 
 
	var orbitistGeoJson = json;
	
	function onEachFeature(feature, layer) {
			// does this feature have a property named popupContent?
			if (feature.properties && feature.properties.name) {
					layer.bindPopup(feature.properties.description);
			}
	}
	
	L.geoJson(orbitistGeoJson, {
			onEachFeature: onEachFeature
	}).addTo(map);
// END ORBITIST POI