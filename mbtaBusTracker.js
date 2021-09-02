mapboxgl.accessToken = 'pk.eyJ1IjoiY2FwdGFpbnBvbGRhcmsiLCJhIjoiY2tzNmRuOHFlMDBhNzJub2M2aDFxbGpmcSJ9.hBTk7JKnxnYAHI8Kc8aeHQ';


var map;
var marker;
const markers = [];
const geojson = {
        "type": "FeatureCollection", "features": markers
    }

//var busImage = 'https://github.com/mapbox/mapbox-gl-styles/blob/master/sprites/basic-v8/_svg/bus-15.svg'


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
    'icon-image': 'bus',
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
        let data = this.map.getSource('markers');
        this.map.getSource('markers').setData(geojson);

}
    //moveMarkers();
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
    'id': bus.id,
    'moving': bus.attributes.direction_id,
    'occupancy': bus.attributes.occupancy_status,
    'marker-color': '#26ad36',
    'marker-size': 'small',
    'icon-image': 'bus'
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

window.onload = init();