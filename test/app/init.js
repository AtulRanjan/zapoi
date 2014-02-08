var passportStub = require('passport-stub'),
  server = require('../../app'),
  env = require('../../app/config/environments'),
  utils = require('../../app/utils/utils'),
  fs = require('fs'),
  http;

// Load test goodies
before(function (done) {

  // Connect to mongodb
  server.mongoose.connect(env.dbUrl);

  // Start the app
  http = server.app.listen(env.port);

  // Install passport stub
  passportStub.install(server.app);

  // Load fixtures
  exports.fixtures = {};
  var fixturesDir = './features/fixtures/';
  var files = fs.readdirSync(fixturesDir);

  for (var i in files) {
    if (utils.endsWith(files[i], '.json')) {
      var fileName = '../../features/fixtures/' + files[i];
      var ruleName = files[i].replace('.json', '');
      exports.fixtures[ruleName] = require(fileName);
    }
  }

  // Go on..
  done();
});

// Clean up the mess..
after(function (done) {
  // Stop the app and free the db connection
  http.close();

  // Drop the database and close the connection
  server.mongoose.connection.db.dropDatabase(function () {
    // Close the mongoose connection
    server.mongoose.connection.close(function () {
      done();
    });
  });
});

exports.app = server.app;

exports.loggedAs = function (userData) {
  passportStub.login([{
    email: userData.username,
    name: userData.name
  }]);
}

exports.loggedOut = function () {
  passportStub.logout();
}