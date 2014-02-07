var test = require('../init'),
  utils = require('../utils');

describe('Registration', function () {

  describe('Routes', function () {

    describe('Not logged', function (done) {

      before(function () {
        test.loggedOut();
      });

      it('GET /register should return 200 OK', function (done) {
        utils.gets(test.app, '/register', done);
      });

      it('POST /register should return 200 OK', function (done) {
        utils.gets(test.app, '/register', done);
      });
    });

    describe('Logged', function (done) {

      before(function () {
        test.loggedAs(test.fixtures.users.Jamie);
      });

      it('GET /register should redirect to the home page', function (done) {
        utils.getRedirects(test.app, '/register', '/', done);
      });

      it('POST /register should redirect to the home page', function (done) {
        utils.postRedirects(test.app, '/register', '/', done);
      });
    });
  });
});