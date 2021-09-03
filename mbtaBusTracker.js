mapboxgl.accessToken = 'pk.eyJ1IjoiY2FwdGFpbnBvbGRhcmsiLCJhIjoiY2tzNmRuOHFlMDBhNzJub2M2aDFxbGpmcSJ9.hBTk7JKnxnYAHI8Kc8aeHQ';


var map;
var marker;
const markers = [];
const geojson = {
        "type": "FeatureCollection", "features": markers
    }

    const layerList = document.getElementById('menu');
    const inputs = layerList.getElementsByTagName('input');
     
    for (const input of inputs) {
    input.onclick = (layer) => {
    const layerId = layer.target.id;
    map.setStyle('mapbox://styles/mapbox/' + layerId);
    };
    }


function init(){
	map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-71.101,42.358],
    zoom: 14
    })
    //this.map.loadImage(busImage);
    
 addMarkers(map);
}


// Add bus markers to map
async function addMarkers(map){
	// get bus data
	var locations = await getBusLocations();

	// loop through data, add bus markers
	locations.forEach(function(bus){
		//console.log("Bus ID: "+ bus.id);
		var marker = getMarker(bus.id);		
		if (marker){
			setMarker(marker, bus);
		}
		else{
			marker = addMarker(bus);		
		}
	});

	// timer
	console.log("Map Updated: " + new Date());
    
    if( !this.map.getLayer('markers')){
    this.map.addSource('markers', {
    'type': 'geojson',
    'data': {
    'type': 'FeatureCollection',
    'features': markers
    }
    });
 
    this.map.addLayer({
    'id': 'markers',
    'type': 'symbol',
    'source': 'markers',
    'layout': {
    // get the title name from the source's "title" property
    'text-field': ['upcase', ['get', 'id']],
    'icon-image':'bus',
    'text-font': [
        'Open Sans Semibold',
        'Arial Unicode MS Bold'
        ],
    'text-offset': [0, 1],
    'text-anchor': 'top',
    }
});
}
    
else{
        
        this.map.getSource('markers').setData(geojson);

    }
     
    let popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
        });

        this.map.on('mouseenter', 'markers', (e) => {
            // Change the cursor style as a UI indicator.
            this.map.getCanvas().style.cursor = 'pointer';
             
            // Copy coordinates array.
            let coordinates = e.features[0].geometry.coordinates.slice();

            //call getDescription to fill popup
            let description = getDescription(e);
            // Populate the popup and set its coordinates
            // based on the feature found.
            popup.setLngLat(coordinates).setHTML(description).addTo(this.map);
            });
             
            this.map.on('mouseleave', 'markers', () => {
            this.map.getCanvas().style.cursor = '';
            popup.remove();
            });

	setTimeout(addMarkers,5000);
}

// Request bus data from MBTA
async function getBusLocations(){
	var url = 'https://api-v3.mbta.com/vehicles?api_key=4ec74667795b4d148b04426d5bae4fe9&filter[route]=1&include=trip';	
	var response = await fetch(url);
	var json     = await response.json();
	return json.data;
}

function addMarker(bus){
    let icon = getIcon(bus.attributes.direction_id);
    marker = {
    'type': 'Feature',
    'geometry': {
    'type': 'Point',
    'coordinates': [bus.attributes.longitude, bus.attributes.latitude]
    },
    'properties': {
    'title':bus.id,
    "icon": {
        "iconUrl": "/mapbox.js/assets/images/astronaut1.png",
        "iconSize": [50, 50], // size of the icon
        "iconAnchor": [25, 25], // point of the icon which will correspond to marker's location
        "popupAnchor": [0, -25], // point from which the popup should open relative to the iconAnchor
        "className": "dot"
    },
    'id': bus.id,
    'moving': bus.attributes.direction_id,
    'occupancy': bus.attributes.occupancy_status,
    //'bikes': bus.included.bikes_allowed,
    //'wheelchair': bus.included.wheelchair_accessible,
    //'headsign': bus.included.headsign
    }
    };
    
    

    markers.push(marker);
    }

function getIcon(direction){
	// select icon based on if bus is moving
	if (direction === 0) {
		return 'redBus';
	}
	return 'blueBus';	
}

function getMarker(id){
    
	var marker = markers.find(function(item){
		return item.properties.id === id;
	});
	return marker;

}

function setMarker(marker, bus){
    let icon = getIcon(bus.attributes.direction_id);
    let coordinates = [bus.attributes.longitude, bus.attributes.latitude];
    marker.geometry.coordinates = coordinates;
    marker.properties.icon = icon;
    marker.properties.moving = bus.attributes.direction_id;
    marker.properties.description = bus.attributes.occupancy_status;

    
}
function getDescription(e){
    let occupancy = e.features[0].properties.occupancy;
    let headsign = e.features[0].properties.headsign;
    let handicap = e.features[0].properties.wheelchair_accessible;
    let bikes = e.features[0].properties.bikes_allowed;
    let description = /* "Destination: " + headsign + " " + */occupancy + " ";
    if (handicap == 1){
        description += "Handicap accessible ";
    }
    if (bikes == 1){
        description += "Bikes allowed "
    }
    return description;
}
window.onload = init();