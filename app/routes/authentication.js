var passport = require('passport'),
  config = require('../config/environments.js');


module.exports = function (app) {

  app.namespace(config.baseUrl, function () {

    app.post('/login', passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/',
      failureFlash: 'Invalid username or password.'
    }));

    app.get('/logout', function (req, res) {
      req.logout();
      res.redirect('/');
    });

  });
};