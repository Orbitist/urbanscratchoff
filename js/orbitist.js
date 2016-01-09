var mapId = 1596;
		
// Retrieve map info
jQuery(document).ready(
    function(){
        jQuery.getJSON(
            'https://app.orbitist.com/api/v1/map_info.json?nid=' + mapId,
            function(data){
                // ciclo l'array
                for(i=0; i<data.length; i++){
                    var  content  = '<img src="';
                         content +=  data[i].mapimage;
                         content  += '" class="img-responsive">';
                    	 	 content  += '<div class="story-slide-content"><h4>';
                         content +=  data[i].maptitle;
                         content  += '</h4>';
                         content +=  data[i].mapbody;
                         content +=  '</div>';
                         cartodbkey =  data[i].mapcartodbkey;
                         basemapurl =  data[i].mapbasemap;
                         custombasemapurl = data[i].custombasemap;
                         customcss = data[i].mapcss;
                    jQuery('div.mapinfo').append(content);
                  	jQuery('head').append('<style>' + customcss + '</style>');
					// Add cartodb layer
					cartodb.createLayer(map, cartodbkey).addTo(map);
					// Add ZXY tile layers
					if ( basemapurl.length > 10 ) {
						L.tileLayer(basemapurl, {
							attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors © <a href="http://mapbox.com/map-feedback/">Mapbox</a>'
						}).addTo(map);
					}
					if ( custombasemapurl.length > 10 ) {
						L.tileLayer(custombasemapurl).addTo(map);
					}
                }
            }
        );
    }
);

// Set lat/long where the map initiates and at what zoom level
var map = new L.Map('map',{maxZoom: 18});





// Get points //
var json = (function () {
    var json = null;
    jQuery.ajax({
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
  
// ADVANCED: This tells the map what goes in popups.
function orbitistPopup(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.name) {
        layer.bindPopup(feature.properties.description, {closeButton: false});
    }
}

// Set cluster var
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

// Use leaflet hash
var hash = new L.Hash(map);
// Use leaflet locate control
L.control.locate().addTo(map);