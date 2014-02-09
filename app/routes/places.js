var config = require('../config/environments.js'),
  geocoder = require('geocoder'),
  Place = require('../models/place'),
  utils = require('../utils/utils'),
  form = require('express-form'),
  validate = form.validate;


module.exports = function (app) {

  app.namespace(config.baseUrl, function () {

    app.get('/places/add', function (req, res) {
      res.render('addplace', {
        user: req.user,
        messages: req.flash('error')
      });
    })

    app.post('/places/add',

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
  });
};