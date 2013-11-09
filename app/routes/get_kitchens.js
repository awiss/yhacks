var gm = require('googlemaps');
var key = "AIzaSyDEyGvb_6XqOvFH3xKEChUfCnnXpLkS8L4";
var request = require('request');
// var map;
// var infowindow;
// var pyrmont=new google.maps.LatLng(-30, 30);
// var address="12004 Montrose Village Terr rockville MD 20852";
// var directionsService = new google.maps.DirectionsService();
// var geocode;
// var newOne;
// var listOfLocations=new Array;


// function initialize() {
//     console.log(pyrmont);
//    geocode = new google.maps.Geocoder();
//     geo();
// }


// function geo(){
// var request = {
//     address: address,
//   };
//   geocode.geocode(request, callBackGeofunction);

// }
exports.getKitchens = function(lat,lng,cb){
  var latLng = lat.toString() + "," + lng.toString();
  var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
  url += "key=" + key;
  url += "&location=" + latLng;
  url += "&radius=" + "15000";
  url += "&sensor=" + "false";
  url += "&keyword=" + "soup%20kitchen";
  url += "&rankby=" + "prominence";

  console.log(url);
  request(url,function (error, response, body) {
    console.log(error);
    if (response.statusCode == 200) {
      cb(error,body);
    } else {
      cb(response.statusCode,body);
    }
  });
}

function callBackGeofunction(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      pyrmont=results[0].geometry.location;
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: pyrmont,
    zoom: 15
  });
  var request = {
    location: pyrmont,
    radius: 500,
    query: ['soup kitchen','food pantry']
  };
  infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
    }
}


// function kitchen(name, address, location)
// {
// this.name=name;
// this.address=address;
// this.location=location;
// }


function callback(results, status) {
  console.log(results);
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      listOfLocations.push(new kitchen(results[i].name, results[i].formatted_address, results[i].geometry.location));
    }
    console.log(print(listOfLocations));
  }
}


// function print(array){
//   var ret="";
//   for(var i=0;i<array.length;i++){
//     ret=ret+(array[i].name + " " + array[i].address + "\n");
//   }
//   return ret;
// }


// function printDir(name){
//   var loc;
//   var ret="";
//   for (var i = 0; i < listOfLocations.length; i++) {
//       if(listOfLocations[i].name==name){
//         loc=listOfLocations[i].location;
//         break;
//       }
//     }
//     var request={
//       origin:pyrmont,
//       destination: loc.toString(),
//       travelMode: google.maps.TravelMode.WALKING
//     };
//      directionsService.route(request, function(response, status) {
//     if (status == google.maps.DirectionsStatus.OK) {
//       console.log(response);
//       console.log(response.routes[0].legs[0].steps);
//         for (var i = 0; i < response.routes[0].legs[0].steps.length; i++) {
//       ret+=response.routes[0].legs[0].steps[i].instructions+"\n";
//       }
//       console.log(ret);
//     }
//   });
//     return loc;
// }


// function createMarker(place) {
//   var placeLoc = place.geometry.location;
//   var marker = new google.maps.Marker({
//     map: map,
//     position: place.geometry.location
//   });

//   google.maps.event.addListener(marker, 'click', function() {
//     infowindow.setContent(place.name);
//     infowindow.open(map, this);
//   });
// }