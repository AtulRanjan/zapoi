var env = require('../config/environments.js');

exports.ensureLoggedIn = function (req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect(env.baseUrl + '/');
  }
};


exports.ensureNotLoggedIn = function (req, res, next) {
  if (req.user) {
    res.redirect(env.baseUrl + '/');
  } else {
    next();
  }
};