var passport = require('passport'),
  config = require('../config/environments.js'),
  User = require('../models/user'),
  form = require('express-form'),
  ensureNotLoggedIn = require('../utils/middlewares').ensureNotLoggedIn,
  validate = form.validate;


module.exports = function (app) {

  app.namespace(config.baseUrl, function () {

    app.get('/register', ensureNotLoggedIn, function (req, res) {
      return res.render('registration');
    });

    app.post('/register',
      ensureNotLoggedIn,
      form(
        validate("email").trim().required('Email', 'The email address field is required.')
        .isEmail("Please enter a valid email address."),
        validate("displayName").trim().required('Display name', 'The display name field is required.')
        .is(/^.{3,}$/, "The name field must be at least 3 characters."),
        validate("password").trim().required('Password', 'The password field is required.')
        .is(/^.{6,}$/, "The password field must be at least 6 characters."),
        validate("passwordConfirmation").equals("field::password", "Passwords don't match.")
      ),
      function (req, res) {
        if (!req.form.isValid) {
          return res.render('registration', {
            messages: req.flash('error')
          });
        } else {
          User.register(new User({
            email: req.body.email.trim(),
            name: req.body.displayName.trim(),
          }), req.body.password, function (err, account) {
            if (err) {
              return res.render('registration', {
                messages: ['Username is already taken.']
              });
            }

            passport.authenticate('local')(req, res, function () {
              res.redirect('/');
            });
          });
        }
      });
  });
};