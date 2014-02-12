var server = require('../../app.js'),
  env = require('../../app/config/environments.js'),
  passportStub = require('passport-stub'),
  http;

module.exports = function () {
  this.Before(function (callback) {
    http = server.app.listen(env.port);

    // Install passport stub
    passportStub.install(server.app);

    callback();
  });

  this.After(function (callback) {
    passportStub.logout();

    // Stop the app
    http.close();

    // Drop the database at the end
    server.mongoose.connection.db.dropDatabase(function (err) {
      callback();
    });
  });
};