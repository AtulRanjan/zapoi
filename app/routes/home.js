/*
 * GET home page.
 */

var config = require('../config/environments.js'),
  Place = require('../models/place');


module.exports = function (app) {

  app.namespace(config.baseUrl, function () {

    app.get('/', function (req, res) {
      res.render('index', {
        user: req.user
      });
    });
  });
};