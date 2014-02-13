/*
 * GET home page.
 */

var config = require('../config/environments.js'),
  Place = require('../models/place');


module.exports = function (app) {

  app.namespace(config.baseUrl, function () {

    app.get('/', function (req, res) {
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
        res.render('index', {
          user: req.user,
          places: places,
          messages: req.flash('error')
        });
      });
    });
  });
};