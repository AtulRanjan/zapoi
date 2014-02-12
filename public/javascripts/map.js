var map;
var defaultCoords = {
  lat: 52.3728786,
  lng: 4.893659
};
var markers = [];

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}

function findByCategory(e) {
  var element = $(this);
  var category = element.data("category");

  $.ajax({
    url: baseUrl + '/places/category/' + category,
    dataType: 'json',
    success: function (places) {
      clearMarkers();
      createPlaces(places);
    }
  });
}

function closestHandler(e) {

}

function similarHandler(e) {

}

function initializeMap(x, y) {
  var mapOptions = {
    zoom: 12,
    center: new google.maps.LatLng(x, y)
  };
  map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
  createPlaces(window.places || []);
}

function createPlaces(places) {
  places.forEach(function (place) {
    var categoriesLinks = closestLinks = '';
    place.categories.split(',').forEach(function (category) {
      categoriesLinks += ' <a href="javascript: void(0);" class="find-by-category-link" data-category="' + category + '">' + category + '</a>';
      closestLinks += ' <a href="javascript;" class="find-closest-link" data-category="' + category + '" data-coords="' + place.location.lat + ',' + place.location.lng + '">' + category + '</a>';
    })

    var contentString =
      '<div id="content">' +
      '<div id="siteNotice">' +
      '</div>' +
      '<h3 id="firstHeading" class="firstHeading">' + place.name + '</h3>' +
      '<div id="bodyContent">' +
      '<p>' + place.description + '</p>' +
      (place.additionalInfo.phone ? '<p>Phone: ' + place.additionalInfo.phone + '</p>' : '') +
      (place.additionalInfo.website ? '<p>Website: <a href="' + place.additionalInfo.website + '">' + place.additionalInfo.website + '</a></p>' : '') +
      '<div id="buttons">' +
      'Show:' +
      '<ll>' +
      '<li>All of type:' + categoriesLinks + '</li>' +
      '<li>Closest 5: ' + closestLinks + '</li>' +
      '<li><a href="javascript;" class="find-similar-link" data-place="' + JSON.stringify(place) + '">Similar</a></li>' +
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
  });
}



function initialize() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        initializeMap(position.coords.latitude, position.coords.longitude);
      },
      function (err) {
        initializeMap(defaultCoords.lat, defaultCoords.lng)
      }
    );
  } else {
    initializeMap(defaultCoords.lat, defaultCoords.lng)
  }

  // handle clicks on special links in the infowindows
  $('body').on('click', '.find-by-category-link', findByCategory);
  $('body').on('click', '.find-closest-link', findByCategory);
  $('body').on('click', '.find-similar-link', findByCategory);
}


google.maps.event.addDomListener(window, 'load', initialize);