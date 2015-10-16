//////////////////////// JAVASCRIPT FOR  /////////////////////
var galleryMap = galleryMap || {
	init: function(){
		galleryMap.share();
		galleryMap.createMap();
	},
	share: function(){
		$(".icon-twitter").on("click", function(){
			var tweet = ""; //Tweet text
			var url = ""; //Interactive URL
			var twitter_url = "https://twitter.com/intent/tweet?text="+tweet+"&url="+url+"&tw_p=tweetbutton";
			window.open(twitter_url, 'mywin','left=200,top=200,width=500,height=300,toolbar=1,resizable=0'); return false;
		});
		$(".icon-facebook").on("click", function(){
			var picture = ""; //Picture URL
			var title = ""; //Post title
			var description = ""; //Post description
			var url = ""; //Interactive URL
			var facebook_url = "https://www.facebook.com/dialog/feed?display=popup&app_id=310302989040998&link="+url+"&picture="+picture+"&name="+title+"&description="+description+"&redirect_uri=http://www.facebook.com";    		
			window.open(facebook_url, 'mywin','left=200,top=200,width=500,height=300,toolbar=1,resizable=0'); return false;
		});		
	},
	// Put your fusion table key here to populate with new data/pictures
	// For your convenience, I recommend duplicating and editing the following:
	// https://www.google.com/fusiontables/DataSource?docid=1sRNq3jiNQXTvCmT9fU3CbjBH_iNuVW_Sguv5CbVY
	fusionTableID: '1sRNq3jiNQXTvCmT9fU3CbjBH_iNuVW_Sguv5CbVY', 
	createMap: function() {
		// If mobile, an overlay is displayed, showing instructions on how to 
		// use the gallery. The overlay is removed with a click or swipe.
		$.mobile.loading().hide();
		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
			var overlay = jQuery('<div id="overlay">Swipe the image or tap the arrows to navigate</div>');
			overlay.appendTo(document.body)
			$('#overlay').click(function() {
				$('#overlay').remove();
			});
			$('#overlay').on('swipe', function() {
				$('#overlay').remove();
			});
		};		
		function initialize() {
			var points = []; // To be populated with data from Fusion table
			google.maps.visualRefresh = true;
			// Generates Google Maps. Options for Google Maps, like different zoom levels,
			// etc. go here.
			var mapDiv = document.getElementById('googft-mapCanvas');
			var map = new google.maps.Map(mapDiv, {
				center: new google.maps.LatLng(39.295160975594534, -76.61205593609809),
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				zoomControl: true,
				zoomControlOptions: {
					position: google.maps.ControlPosition.TOP_LEFT
				},
				streetViewControl:false,
				mapTypeControl:false
			});
			var layer = new google.maps.FusionTablesLayer({
				map: map,
				heatmap: { enabled: false },
				query: {
					select: "col2",
					// Change this to appropriate fusion talbe
					from: galleryMap.fusionTableID,
					where: ""
				},
				options: {
					styleId: 2,
					templateId: 2,
					suppressInfoWindows:true
				}
			});
			// We create the InfoWindow -- the tooltip -- early so tha we can
			// replace the content of it in the code that will follow below.
			var infowindow = new google.maps.InfoWindow();
			// Below we set the map zoom for mobile.
			if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
				map.setZoom(14);
			} else {
				map.setZoom(15);
			}
			// This function outputs the fusion table as JSON
			var getTable = function() {
				var query = "SELECT 'number', 'address', 'text', 'photo', 'cutline' FROM " + galleryMap.fusionTableID;
				var encodedQuery = encodeURIComponent(query);
				var url = ['https://www.googleapis.com/fusiontables/v1/query'];
				url.push('?sql=' + encodedQuery);
				url.push('&key=AIzaSyAo0g4fPJsIkMjJMjScZ5vb_zamAWUEkjo');
				url.push('&callback=?');	
				// Send the JSONP request using jQuery
				$.ajax({
					url: url.join(''),
					dataType: 'jsonp',
					success: function (data) {
						var rows = data['rows'];
						for (var i in rows) {
							var id = Number(rows[i][0]);
							var address = rows[i][1];
							var text = rows[i][2];							
							var photo = rows[i][3];
							var cutline = rows[i][4];
							points.push({"id":id,"address":address,"text":text,"photo":photo,"cutline":cutline});
						};
						// Upon successfully outputting as JSON, the results
						// are passed into the trigger function.
						trigger(points);
					}
				});	
			};
			// This function determines what happens when a button is clicked
			// or when the screen is swiped on mobile.
			var trigger = function(points) {
				// This counter keeps track of where you are in the data and
				// the fusion table/map. It will increment or decrement
				// according to the user's input.
 				var counter=0;
 				// The geocoder object will pull in address information
 				// and geocode it, allowing the map to go to that point
 				// upon user input.
				var geocoder = new google.maps.Geocoder();
				// The text for the page is loaded through the JSON data,
				// using the counter to figure out which data to load.
				// Here, we are initializing the page with data for the
				// first point on the map.				
				$('#subhead').text(points[counter].text);
				$('#image').attr('src',points[counter].photo);
				$('#cutline').text(points[counter].cutline);
				geocoder.geocode({
					address: points[counter].address
				}, function(results, status) {
					// After the geocoder succesffully geocodes the address,
					// we center the map on the coordinates and then
					// populate the infowindow at that location.
					map.panTo(results[0].geometry.location);
					infowindow.setContent(points[counter].address);
					infowindow.setPosition(results[0].geometry.location);
					infowindow.open(map);
				});
				// Below are all of the events that can increment or decrement
				// the counter. In other words, every time a button is clicked
				// or the screen is swiped to go to the next image/point, it is
				// logged here and the counter changes appropriately.
				$('#galleryMap__nav__button--next').click(function() {
					if (counter == points.length-1) {
						counter = 0;
					} else {
						counter++;
					}
					// After incrementing the counter, we call the
					// triggerAction function, which will use the
					// new counter number to populate the page
					// with new data.
					triggerAction();						
				});
				$('#galleryMap__nav__button--prev').click(function() {
					if (counter == 0) {
						counter = points.length-1;
					} else {
						counter--;					
					};
					triggerAction();						
				});
				// This code is the same as above but for swiping on mobile.
				if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
					$('.galleryMap').on("swiperight", function() {						
						if (counter == 0) {
							counter = points.length-1;
						} else {
							counter--;
						};
						triggerAction();
					});
					$('.galleryMap').on("swipeleft", function() {
						if (counter == points.length-1) {
							counter = 0;
						} else {
							counter++;
						};
						triggerAction();						
					});	
				};		
				// This code changes the counter number according to the point
				// clicked on the map.
				google.maps.event.addListener(layer, 'click', function(e) {
					counter = e.row.number.value;
					triggerAction();
				});	
				// The function below is the same as when the page initalized
				// on the first point. It uses the counter to determine
				// what position to pull the data from, geocodes the address,
				// populates the infowindow, then populates the rest of the
				// page.
				var triggerAction = function() {
					geocoder.geocode({
						address: points[counter].address
					}, function(results, status) {
						map.panTo(results[0].geometry.location);
						infowindow.close(map);
						infowindow.setContent(points[counter].address);
						infowindow.setPosition(results[0].geometry.location);
						infowindow.open(map);
					});
					// Fade effects are added for pizazz.
					$('#subhead').fadeOut("fast", function() {
						$('#subhead').text(points[counter].text);
					});
					$('#subhead').fadeIn("fast");
					$('#image').fadeOut("fast", function() {
						$('#image').attr('src',points[counter].photo);
					});
					$('#image').fadeIn("fast");		
					$('#cutline').fadeOut("fast", function() {
						$('#cutline').text(points[counter].cutline);	
					});
					$('#cutline').fadeIn("fast");
					updateOmniture();
				};		
			};
			// We call the getTable() function to start the whole process
			// because I'm a bad programmer who nests functions for no reason.
			getTable();			
		};
		// I dunno what this does but it was on the boilerplate code
		google.maps.event.addDomListener(window, 'load', initialize);
	}
}
$(document).ready(function(){
	galleryMap.init();
});
