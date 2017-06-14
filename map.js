$(document).ready(function (){
	L.mapbox.accessToken = 'pk.eyJ1IjoiaWFubG1jZmFyIiwiYSI6ImNqM3RyOHplNzAwYTEycHFtaDBpZTZyMWgifQ.OprQgUsMmlu8TopzcjaJfg';
	var mapGeo = L.mapbox.map('map_geo', 'mapbox.light')
	  .setView([37.80477,-122.403234], 13);
	var stationlayer = L.mapbox.featureLayer().setGeoJSON(geojson).addTo(mapGeo);
	var tooltiplayer = L.mapbox.featureLayer().addTo(mapGeo);
	
	var dow = 0
	var tod = 'any'
	
	// console.log(demand_tod, demand_dow)
	
	function get_features(){
		var dem_opt = {'any': demand_dow, 'AM': demand_tod, 'PM': demand_tod}
		var dems = dem_opt[tod]
		for (i=0; i < dems.length; i++){
			if (dems[i]['dow'] == dow && (dems[i]['tod'] == tod || !dems[i].hasOwnProperty("tod"))){
				for (j=0; j < geojson.features.length; j++){
					if (geojson.features[j].properties.title == dems[i]['station']){
						geojson.features[j].properties['marker-color'] = dems[i].net_rides_avg.toFixed(0) < 0 ? '#ff0000' : '#00FF00';
						geojson.features[j].properties['marker-symbol'] = Math.abs(dems[i].net_rides_avg.toFixed(0));
						geojson.features[j].properties['CI'] = [(dems[i].net_rides_avg-dems[i].net_rides_CIL).toFixed(2), (dems[i].net_rides_avg-dems[i].net_rides_CIH).toFixed(2)]
						geojson.features[j].properties['mean_flow'] = Math.abs(dems[i].net_rides_avg.toFixed(0));
					}
				}
			}
		}
	}
	get_features();
	
	// function system_supply(){
	// 	var dem_opt = {'any': demand_dow, 'time': demand_tod}
	// 	var dems = dem_opt[tod]
	// 	var short = 0, surplus = 0;
	// 	for (i=0; i < dems.length; i++){
	// 		if (dems[i]['dow'] == dow && (dems[i]['tod'] == tod || !dems[i].hasOwnProperty("tod"))){
	// 			// console.log(dems[i].net_rides_avg)
	// 			dems[i].net_rides_avg < 0 ? short += dems[i].net_rides_avg : surplus += dems[i].net_rides_avg;
	// 		}
	// 	}
	// 	// console.log(short, surplus)
	// }
	// system_supply();
	//
	
	tooltiplayer.on('click',function(e) {
	    e.layer.closePopup();
	    var feature = e.layer.feature;
		$('#title').html('<strong>'+feature.properties.title+'</strong>')
		$('#docks').html('Number of Docks:'+feature.properties.dockcount)
		$('#interval').html('['+feature.properties.CI[1]+' , '+feature.properties.CI[0]+']  (90% conf. interval)')
	});
	mapGeo.on('move', empty);
	empty();

	function empty() {
		$('#title, #docks, #interval').html('')
	}
	
	$('#dow, #tod').change(function(){
		dow = $('#dow').val()
		tod = $('#tod').val()
		get_features();
		
		stationlayer.clearLayers()
		stationlayer.setGeoJSON(geojson)
		tooltiplayer.setGeoJSON(geojson)
	})
	
	stationlayer.clearLayers()
	stationlayer.setGeoJSON(geojson)
	tooltiplayer.setGeoJSON(geojson)
})