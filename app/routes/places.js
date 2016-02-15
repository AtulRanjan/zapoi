var config = require('../config/environments.js'),
  geocoder = require('geocoder'),
  Place = require('../models/place'),
  utils = require('../utils/utils'),
  middlewares = require('../utils/middlewares'),
  form = require('express-form'),
  Place = require('../models/place'),
  User = require('../models/user'),
  validate = form.validate;

module.exports = function (app) {

  app.namespace(config.baseUrl + '/places', function () {

    app.get('', function(req, res) {
      Place.find({}, {
        // Exclude certain fields
        __v: 0,
        comments: 0,
        workingHours: 0,
        createdAt: 0,
        isApproved: 0,
        open24hours: 0
      }, {
        skip: 0, // Starting Row
        limit: 50, // Ending Row
        sort: {
          createdAt: -1 // Sort by created date DESC
        }
      }, function (err, places) {
        res.json(places);
      });
    });

    app.get('/add', middlewares.ensureLoggedIn, function (req, res) {
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
      var keywords = req.query.search.split(' ');
      var regex = '(.*)' + (keywords + '').replace(',', '|', 'g') + '(.*)';

      var filter = {
        '$or': [{
          'name': {
            '$regex': regex,
            '$options': 'gi'
          }
        }, {
          'categories': {
            '$in': keywords
          }
        }, {
          'description': {
            '$regex': regex,
            '$options': 'gi'
          }
        }, {
          'address': {
            '$regex': regex,
            '$options': 'gi'
          }
        }]
      };
      var fields = {
        __v: 0,
        comments: 0,
        workingHours: 0,
        createdAt: 0,
        isApproved: 0,
        open24hours: 0
      };
      var options = {
        limit: 50
      };

      Place.find(filter, fields, options, function (err, places) {
        res.render('index', {
          places: places,

          user: req.user,
          messages: req.flash('error')
        });
      })
    });

    app.get('/closest/:category/:coords', function (req, res) {
      var limit = req.query.limit || 5;
      var coords = req.params.coords.split(',');
      var category = req.params.category;

      var filter = {
        'categories': category,
        'location': {
          '$near': {
            '$geometry': {
              type: "Point",
              coordinates: coords
            }
          }
        }
      };

      var options = {
        limit: limit + 1 //return the 'limit' nearest places and the starting place too
      };

      Place.find(filter, {}, options, function (err, places) {
        res.json(places);
      });
    });

    app.get('/similar/:placeId/:page?', function (req, res) {
      var placeId = req.params.placeId;
      var page = Math.abs(parseInt(req.params.page) || 1);

      var limit = 50;
      var skip = (page - 1) * limit;

      Place.findOne({
        _id: placeId
      }, function (err, place) {
        Place.find({
          'additionalInfo.priceLevel': place.additionalInfo.priceLevel
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

    app.post('/like', function (req, res) {
      Place.findById(req.body.place, function (err, place) {
        if (err) {
          return res.json(false);
        }

        req.user.likePlace(place, function () {
          res.json(true);
        })
      });
    });

    app.post('/dislike', function (req, res) {
      Place.findById(req.body.place, function (err, place) {
        if (err) {
          return res.json(false);
        }

        req.user.dislikePlace(place._id, function (err) {
          if (err) {
            res.json(false);
          }
          res.json(true);
        })
      });
    });

    app.get('/liked', middlewares.ensureLoggedIn, function (req, res) {
      User.findOne({
        _id: req.user._id
      }).populate('likedPlaces',
        '-__v -comments -workingHours -createdAt -isApproved -open24hours')
        .exec(function (err, user) {
          res.render('index', {
            user: req.user,
            places: user.likedPlaces
          });
        });
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