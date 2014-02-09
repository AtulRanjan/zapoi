var test = require('../init'),
  request = require('supertest'),
  utils = require('../utils');

describe('Places', function () {

  describe('Add place', function () {

    describe('Routes', function () {

      describe('Not logged', function (done) {

        before(function () {
          test.loggedOut();
        });

        it('GET /places/add should return 200 OK', function (done) {
          utils.gets(test.app, '/places/add', done);
        });

        it('POST /places/add should return 403 forbidden error', function (done) {
          request(test.app).post('/places/add').expect(403).end(done);
        });
      });

      describe('Logged', function (done) {

        before(function () {
          test.loggedAs(test.fixtures.users.Jamie);
        });

        it('GET /places/add should return 200 OK', function (done) {
          utils.gets(test.app, '/places/add', done);
        });

        it('POST /places/add should return 403 forbidden error', function (done) {
          request(test.app).post('/places/add').expect(403).end(done);
        });
      });
    });
  });
});