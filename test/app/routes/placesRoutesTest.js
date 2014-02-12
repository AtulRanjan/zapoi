var test = require('../init'),
  request = require('supertest'),
  utils = require('../utils'),
  should = require('should'),
  Place = require('../../../app/models/place');

describe('Places', function () {

  describe('Add place', function () {

    describe('Routes', function () {

      describe('Not logged', function (done) {

        before(function () {
          test.loggedOut();
        });

        it('GET /places/add should redirect to the home page', function (done) {
          utils.getRedirects(test.app, '/places/add', '/', done);
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

  describe('AJAX endpoints', function () {

    describe('Routes', function () {

      describe('Not logged', function () {

        before(function () {
          test.loggedOut();
        });

        it('GET /places/category/_ should return 200 OK', function (done) {
          utils.gets(test.app, '/places/category/_', done);
        });
      });

      describe('Logged', function () {

        before(function () {
          test.loggedAs(test.fixtures.users.Jamie);
        });

        it('GET /places/category/_ should return 200 OK', function (done) {
          utils.gets(test.app, '/places/category/_', done);
        });
      });
    });

    describe('Content', function () {

      afterEach(function (done) {
        Place.remove(done);
      });

      beforeEach(function (done) {
        // both places having "pharmacy" in their categories
        Place.remove(function () {
          new Place(test.fixtures.places.pharmacy).save(function () {
            new Place(test.fixtures.places.pharmacy2).save(done);
          });
        });
      });

      it('GET /places/category/{cat} returns JSON containing places with a given category', function (done) {
        var category = test.fixtures.places.pharmacy.categories.split(',').shift();
        request(test.app).get('/places/category/' + category).expect(function (res) {
          var places = res.body;

          should.notEqual(places, undefined);
          should.equal(places.length, 2);

          var originalPlacesNames = [test.fixtures.places.pharmacy.name, test.fixtures.places.pharmacy2.name];
          var returedPlacesNames = places.map(function (place) {
            return place.name;
          });

          // assert only the names as it is enough
          originalPlacesNames.sort().should.eql(returedPlacesNames.sort());
        }).end(done);
      });
    });
  });
});