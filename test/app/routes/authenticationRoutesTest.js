var test = require('../init'),
  request = require('supertest'),
  utils = require('../utils');

describe('Authentication', function () {

  describe('Routes', function () {

    describe('Not logged', function (done) {

      before(function () {
        test.loggedOut();
      });

      it('POST /login should return 403 forbidden error', function (done) {
        request(test.app).post('/login').expect(403).end(done);
      });
    }),

    describe('Logged', function (done) {

      before(function () {
        test.loggedAs(test.fixtures.users.Jamie);
      });

      it('GET /logout should return redirect to home page', function (done) {
        utils.getRedirects(test.app, '/logout', '/', done);
      });
    });
  });
});