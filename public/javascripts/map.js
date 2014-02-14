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

function findByCategory() {
  var element = $(this);
  var category = element.data("category");

  $.ajax({
    url: baseUrl + '/places/category/' + category,
    dataType: 'json',
    success: function (places) {
      clearMarkers();
      createPlaces(places, 'All ' + category);
    }
  });
}

function likePlace() {
  var element = $(this);
  var placeHash = element.data("place");

  $.ajax({
    method: 'POST',
    url: baseUrl + '/places/like/',
    data: {
      place: placeHash
    },
    success: function (data) {
      element.text('Disike this place');
      element.on('click', dislikePlace);
    }
  });
}

function dislikePlace() {
  var element = $(this);
  var placeHash = element.data("place");

  $.ajax({
    method: 'POST',
    url: baseUrl + '/places/dislike/',
    data: {
      place: placeHash
    },
    success: function (data) {
      element.text('Like this place');
      element.on('click', likePlace);
    }
  });
}


function closestHandler(e) {
  var element = $(this);
  var category = element.data('category');
  var coords = element.data('coords');

  $.ajax({
    url: baseUrl + '/places/closest/' + category + '/' + coords,
    dataType: 'json',
    success: function (places) {
      clearMarkers();
      createPlaces(places, 'Closest ' + category);
    }
  });
}

function findSimilarPlaces() {
  var element = $(this);
  var placeHash = element.data("place");

  $.ajax({
    url: baseUrl + '/places/similar/' + placeHash,
    dataType: 'json',
    success: function (places) {
      clearMarkers();
      createPlaces(places, 'Similar');
    }
  });
}

function initializeMap(x, y) {
  var mapOptions = {
    zoom: 12,
    center: new google.maps.LatLng(x, y)
  };
  map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
  createPlaces(window.places || []);
}

function createPlaces(places, title) {
  var sidebarTitle = title || 'On the map';
  $('ul.nav.nav-list > *').remove();
  $('ul.nav.nav-list').append('<li class="nav-header">' + sidebarTitle + '</li>')
  $('ul.nav.nav-list > li.nav-header').append('<a href="javascript: void(0);" title="Refresh map" class="refresh-btn pull-right btn btn-link btn-lg" role="button">' + 
    '<i class="icon-refresh"> </i> ' + 
    '</a>');
  $('a.refresh-btn').click(function(){
    createPlaces(window.places || []);
  });


  places.forEach(function (place, index) {
    var categoriesLinks = closestLinks = '';
    place.categories.split(',').forEach(function (category) {
      categoriesLinks += ' <a href="javascript: void(0);" class="find-by-category-link" data-category="' + category + '">' + category + '</a>';
      closestLinks += ' <a href="javascript: void(0);" class="find-closest-link" data-category="' + category + '" data-coords="' + place.location.lat + ',' + place.location.lng + '">' + category + '</a>';
    });

    var isUserLogged = typeof (user) !== 'undefined';
    var likeDislikeLink = '';
    if (isUserLogged && user.likedPlaces.indexOf(place._id) === -1) {
      likeDislikeLink = '<p><a href="javascript: void(0);" class="like-place" data-place="' + place._id + '">Like this place</a></p>';
    } else if (isUserLogged) {
      likeDislikeLink = '<p><a href="javascript: void(0);" class="dislike-place" data-place="' + place._id + '">Dislike this place</a></p>';
    }

    var contentString =
      '<div id="content">' +
      '<div id="siteNotice">' +
      '</div>' +
      '<h3 id="firstHeading" class="firstHeading">' + place.name + '</h3>' +
      '<div id="bodyContent">' +
      '<p>' + place.description + '</p>' +
      (place.additionalInfo.phone ? '<p>Phone: ' + place.additionalInfo.phone + '</p>' : '') +
      (place.additionalInfo.website ? '<p>Website: <a href="' + place.additionalInfo.website + '">' + place.additionalInfo.website + '</a></p>' : '') +
      likeDislikeLink +
      '<div id="buttons">' +
      'Show:' +
      '<ll>' +
      '<li>Find by category:' + categoriesLinks + '</li>' +
      '<li>Closest five: ' + closestLinks + '</li>' +
      '<li><a href="javascript: void(0);" class="find-similar-link" data-place="' + place._id + '">Similar places</a></li>' +
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


    $('ul.nav.nav-list').append('<li class="item"><a href="javascript: void(0)">' + place.name + '</a></li>');
    $('ul.nav.nav-list > li.item:nth-child(' + (index + 2) + ') > a').click(function () {
      markers.forEach(function (marker) {
        marker.infowindow.close(map, marker);
      });
      marker.infowindow.open(map, marker);
    });
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
  $('body').on('click', '.find-closest-link', closestHandler);
  $('body').on('click', '.find-similar-link', findSimilarPlaces);
  $('body').on('click', '.like-place', likePlace);
  $('body').on('click', '.dislike-place', dislikePlace);
}


google.maps.event.addDomListener(window, 'load', initialize);