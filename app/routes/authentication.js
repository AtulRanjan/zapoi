var passport = require('passport'),
  config = require('../config/environments.js');


module.exports = function (app) {

  app.namespace(config.baseUrl, function () {

    app.get('/login', function (req, res) {
      res.render('login', {
        user: req.user
      });
    });

    app.post('/login', passport.authenticate('local'), function (req, res) {
      res.redirect('/');
    });

    app.get('/logout', function (req, res) {
      req.logout();
      res.redirect('/');
    });
  });
};