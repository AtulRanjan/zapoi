// Module dependencies
var fs = require('fs'),
  path = require('path'),
  express = require('express'),
  flash = require('connect-flash'),
  http = require('http'),
  env = require('./app/config/environments.js'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  User = require('./app/models/user.js');
require('express-namespace');


var app = express();

// Configuration
app.configure(function () {
  app.set('views', __dirname + '/app/views');
  app.set('view engine', 'jade');

  // Globally accessible values
  app.set('baseUrl', env.baseUrl);

  app.use(express.cookieParser());
  app.use(flash());

  // Use the following two lines instead of the express.bodyParser
  // until express updates to use Connect 3.0
  app.use(express.json());
  app.use(express.urlencoded());

  app.use(express.session({
    secret: env.sessionSecret
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function () {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});

app.configure('production', function () {
  app.use(express.errorHandler());
});

// Routes
var routeDir = 'app/routes',
  files = fs.readdirSync(routeDir);

files.forEach(function (file) {
  var filePath = path.resolve('./', routeDir, file);
  require(filePath)(app);
});

// Passport config
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.app = app;
exports.mongoose = mongoose;

// And off we go...
if (!module.parent) {
  mongoose.connect(env.dbUrl);
  app.listen(env.port);
  console.log('listening on port ' + env.port);
}
else {
  console.error('something went wrong');
}