var config = require('../config/environments.js'),
  geocoder = require('geocoder'),
  Place = require('../models/place'),
  utils = require('../utils/utils'),
  form = require('express-form'),
  Place = require('../models/place'),
  validate = form.validate;

module.exports = function (app) {

  app.namespace(config.baseUrl + '/places', function () {

    app.get('/add', function (req, res) {
      res.render('addplace', {
        user: req.user,
        messages: req.flash('error')
      });
    });

    app.post('/add',

      form(
        validate("name").trim().required('Name', 'The name field is required.'),
        validate("address").trim().required('Address', 'The address field is required.'),
        validate("categories").trim().required('Categories (comma separated)', 'The categories field is required.')
      ),

      function (req, res) {
        if (!req.form.isValid) {
          return res.render('addplace', {
            messages: req.flash('error')
          });
        } else {
          geocoder.geocode(req.body.address, function (err, data) {
            req.body.location = {
              'lat': 0,
              'lng': 0
            };
            if (data) {
              req.body.location.lat = data.results[0].geometry.location.lat;
              req.body.location.lng = data.results[0].geometry.location.lng;
            }

            new Place(req.body).saveWithImage(null, function (err, place) {

              if (err) {
                return res.render('addplace', {
                  messages: utils.errors(err.errors || err)
                });
              }

              req.flash('error', ['You successfully added a place to zaPOI!']);
              return res.redirect('/');
            });
          });
        }
      });

    app.get('/search', function (req, res) {
      //TODO: implement search
      var result = mockPlaces;

      res.render('index', {
        places: encodeURI(JSON.stringify(result)),

        user: req.user,
        messages: req.flash('error')
      });
    });

    app.get('/closest', function (req, res) {
      var limit = req.params.limit || 50;
      var coords = req.params.coords.split(',');
      var category = req.params.category;

      var result = [];
      for (var i = 0, length = mockPlaces.length; i < length && result.length < limit; i++) {
        if (category in mockPlaces[i].categories) {
          result.push(mockPlaces[i])
        }
      }
      res.send(result);
    });

    app.get('/similar', function (req, res) {
      var place = decodeURI(req.params.original);

      res.send(place);
    });

    app.get('/category/:category/:page?', function (req, res) {
      var category = req.params.category;
      var page = Math.abs(parseInt(req.params.page) || 1);

      var limit = 50;
      var skip = (page - 1) * limit;

      Place.find({
        categories: category
      }, {
        // Exclude certain fields
        __v: 0,
        comments: 0,
        workingHours: 0,
        createdAt: 0,
        isApproved: 0,
        open24hours: 0
      }, {
        skip: skip, // Starting Row
        limit: limit, // Ending Row
        sort: {
          createdAt: -1 // Sort by created date DESC
        }
      }, function (err, places) {
        return res.json(places);
      });
    });
  });
};

var mockPlaces = [{
  "name": "Аптека Ремедиум 1",
  "location": {
    "lat": 42.695384516317105,
    "lng": 23.330819606781006
  },
  "categories": "pharmacy",
  "description": "Аптеки Ремедиум - аптеки със сърце",
  "workingHours": [{
    "opens": 28800,
    "closes": 75600
  }, {
    "opens": 28800,
    "closes": 75600
  }, {
    "opens": 28800,
    "closes": 75600
  }, {
    "opens": 28800,
    "closes": 75600
  }, {
    "opens": 28800,
    "closes": 75600
  }, {
    "opens": 28800,
    "closes": 75600
  }, {
    "opens": 32400,
    "closes": 72000
  }],
  "open24hours": false,
  "additionalInfo": {
    "priceLevel": 1,
    "website": "http://www.remedium.bg/",
    "phone": "+359 2 981 31 29"
  }
}, {
  "name": "Аптека Гален",
  "location": {
    "lat": 41.93508823754436,
    "lng": 25.56097984313965
  },
  "categories": "pharmacy",
  "description": "Денонощна аптека\"Гален\"",
  "workingHours": [{
    "opens": 0,
    "closes": 86400
  }, {
    "opens": 0,
    "closes": 86400
  }, {
    "opens": 0,
    "closes": 86400
  }, {
    "opens": 0,
    "closes": 86400
  }, {
    "opens": 0,
    "closes": 86400
  }, {
    "opens": 0,
    "closes": 86400
  }, {
    "opens": 0,
    "closes": 86400
  }],
  "open24hours": true,
  "additionalInfo": {
    "priceLevel": 2,
    "phone": "+359 38 66 25 46"
  }
}, {
  "name": "Кино Одеон",
  "location": {
    "lat": 42.689007,
    "lng": 23.318979
  },
  "categories": "cinema",
  "description": "Филмотечно кино \"Одеон\"",
  "additionalInfo": {
    "priceLevel": 2,
    "phone": "+359 989 24 69",
    "website": "http://bnf.bg/bg/odeon/",
    "wifi": true,
    "seats": 100
  }
}, {
  "name": "БНБ",
  "location": {
    "lat": 42.6990905269458,
    "lng": 23.325519561767578
  },
  "categories": "bank, government",
  "description": "Българска народна банка",
  "workingHours": [{
    "opens": 28800,
    "closes": 63000
  }, {
    "opens": 28800,
    "closes": 63000
  }, {
    "opens": 28800,
    "closes": 63000
  }, {
    "opens": 28800,
    "closes": 63000
  }, {
    "opens": 28800,
    "closes": 63000
  }, {
    "opens": 0,
    "closes": 0
  }, {
    "opens": 0,
    "closes": 0
  }],
  "open24hours": false,
  "additionalInfo": {
    "phone": "+359 2 91 459",
    "website": "http://www.bnb.bg/"
  }
}]