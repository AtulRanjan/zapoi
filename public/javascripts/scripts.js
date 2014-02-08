var map;

function initialize() {
  if( "geolocation" in navigator){
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var mapOptions = {
          zoom: 12,
          center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
        };
        map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
      },
      function(err){
        alert(err);
      }
    );
  }
  else {
    alert("suck a dick");
  }
}

google.maps.event.addDomListener(window, 'load', initialize);