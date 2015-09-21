/*
    HOMEINFO Google Map front-end library

    (C) 2015 HOMEINFO - Digitale Informationssysteme GmbH

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/


function google_map(param_div, param_full_address, param_strasse, param_hnr, param_plz, param_ort) {

  var div_placeholder = param_div;
  var address = param_full_address;
  var map_lat = "";
  var map_lng = "";

  var strasse = param_strasse;
  var hnr = param_hnr;
  var plz = param_plz;
  var ort = param_ort;

  /*
  console.log("DIV PLACEHOLDER: " + div_placeholder);
  console.log("FULL ADDRESS: " + address);
  console.log("STRASSE: " + strasse);
  console.log("hnr: " + hnr);
  console.log("PLZ: " + plz);
  console.log("ORT: " + ort);
  */

  //check if address is empty
  if (address != "") {

    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({'address': address}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {

      	/*
      	console.log('Result LAT: ' + results[0].geometry.location.lat());
      	console.log('Result LON: ' + results[0].geometry.location.lng());
      	*/
      	map_lat = results[0].geometry.location.lat();
      	map_lng = results[0].geometry.location.lng();

      	function initialize() {

        	var myOptions = {
        	  scaleControl: true,
        	  center: new google.maps.LatLng(map_lat, map_lng),
        	  zoom: 16,
        	  scrollwheel: false,
        	  draggable: true,
        	  mapTypeId: google.maps.MapTypeId.ROADMAP
        	};

        	var map = new google.maps.Map(document.getElementById(div_placeholder), myOptions);
        	var marker = new google.maps.Marker({
        	  map: map,
        	  position: map.getCenter()
        	});

        	var infowindow = new google.maps.InfoWindow();
        	infowindow.setContent('<p style="color:#333333;"><strong>' + strasse + " " + hnr + '</strong><br>' + plz + " " + ort + '</p>');
        	google.maps.event.addListener(marker, 'click', function() {
        		infowindow.open(map, marker);
        	});

        	google.maps.event.addDomListener(window, "resize", function() {
        	   var center = map.getCenter();
        	   google.maps.event.trigger(map, "resize");
        	   map.setCenter(center);
        	});

      	}

      	google.maps.event.addDomListener(window, 'load', initialize);//build google map

      } else {
        //error
        console.log('Geocode was not successful for the following reason: ' + status);
      }
    });

  } else {
    console.log("Address parameter is empty!");
  }

}
