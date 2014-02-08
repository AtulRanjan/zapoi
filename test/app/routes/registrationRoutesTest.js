var test = require('../init'),
  request = require('supertest'),
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

      it('POST /register should return 403 forbidden error', function (done) {
        request(test.app).post('/register').expect(403).end(done);
      });
    });

    describe('Logged', function (done) {

      before(function () {
        test.loggedAs(test.fixtures.users.Jamie);
      });

      it('GET /register should redirect to the home page', function (done) {
        utils.getRedirects(test.app, '/register', '/', done);
      });

      it('POST /register should return 403 forbidden error', function (done) {
        request(test.app).post('/register').expect(403).end(done);
      });
    });
  });
});