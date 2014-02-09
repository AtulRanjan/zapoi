var map;
var coords = {
  lat: 52.3728786,
  lng: 4.893659
}
var markers = [];

function initMap(x, y) {
  var mapOptions = {
    zoom: 12,
    center: new google.maps.LatLng(x, y)
  };
  map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

  var places = window.places || [];
  places.forEach(function initMarker(place) {
    var categoriesLinks = closestLinks = '';
    place.categories.split(',').forEach(function (category) {
      categoriesLinks += ' <a hrev="javascript;" class="alloftype-' + category + '-link">' + category + '</a>';
      closestLinks += ' <a hrev="javascript;" class="closest-' + category + '-link" data-coords="' + place.location.lat + ',' + place.location.lng + '">' + category + '</a>';
    })

    var contentString =
      '<div id="content">' +
      '<div id="siteNotice">' +
      '</div>' +
      '<h3 id="firstHeading" class="firstHeading">' + place.name + '</h3>' +
      '<div id="bodyContent">' +
        '<p>' + place.description + '</p>' +
        ( place.additionalInfo.phone ? '<p>Phone: ' + place.additionalInfo.phone + '</p>' : '' ) + 
        ( place.additionalInfo.website ? '<p>Website: <a href="' + place.additionalInfo.website + '">' + place.additionalInfo.website + '</a></p>' : '' ) + 
      '<div id="buttons">' +
      'Show:' +
      '<ll>' +
      '<li>All of type:' + categoriesLinks + '</li>' +
      '<li>Closest 5: ' + closestLinks + '</li>' +
      '<li><a>Similar</a></li>' +
      '</ll>' +
      '</div>' +
      '</div>';

    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(place.location.lat, place.location.lng),
      map: map,
      title: place.name
    });
    marker.infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    google.maps.event.addListener(marker, 'click', function () {
      markers.forEach(function (marker) {
        marker.infowindow.close(map, marker);
      });
      marker.infowindow.open(map, marker);
    });
    google.maps.event.addListener(map, 'click', function () {
      markers.forEach(function (marker) {
        marker.infowindow.close(map, marker);
      });
    });

    markers.push(marker);
  })
}

function initialize() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        initMap(position.coords.latitude, position.coords.longitude);
      },
      function (err) {
        initMap(defaultcoords.lat, defaultcoords.lng)
      }
    );
  } else {
    initMap(defaultcoords.lat, defaultcoords.lng)
  }
}


google.maps.event.addDomListener(window, 'load', initialize);