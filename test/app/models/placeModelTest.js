var test = require('../init'),
  Place = require('../../../app/models/place'),
  should = require('should'),
  fs = require('fs');

describe('Place', function () {

  describe('creation', function () {

    var publicImagesDir = __dirname + '/../../../public/images/uploads/';

    afterEach(function (done) {

      // remove all the files "uploaded" to public/images/uploads
      var files = fs.readdirSync(publicImagesDir);
      for (var i in files) {
        fs.unlinkSync(publicImagesDir + files[i]);
      }

      // clear out db
      Place.remove(done);
    });

    it("should create new place without a picture", function (done) {
      var place = new Place(test.fixtures.places.pharmacy);
      place.saveWithImage(undefined, function (err, place) {
        should.notEqual(place, undefined);
        done();
      });
    });

    it("should create new place with a picture", function (done) {
      var image = {
        "name": "restaurant.jpg",
        "path": __dirname + "/../../../features/fixtures/images/image.jpg"
      }
      var place = new Place(test.fixtures.places.pharmacy);
      place.saveWithImage(image, function (err, place) {
        should.notEqual(place, undefined);

        var isImageUploaded = false;
        for (var i in fs.readdirSync(publicImagesDir)) {
          isImageUploaded = true;
        }
        should.equal(isImageUploaded, true);

        done();
      });
    });
  }),

  describe('interface', function () {

    before(function (done) {
      new Place(test.fixtures.places.pharmacy).save(function (err, place) {
        done();
      });
    });

    it("should tell its name to the world", function (done) {
      placeRespondsTo("name", done);
    });

    it("should tell its address to the world", function (done) {
      placeRespondsTo("address", done);
    });

    it("should tell its location to the world", function (done) {
      placeRespondsTo("location", done);
    });

    it("should tell its categories to the world", function (done) {
      placeRespondsTo("categories", done);
    });

    it("should tell its working hours to the world", function (done) {
      placeRespondsTo("workingHours", done);
    });

    it("should tell whether its open 24 hours", function (done) {
      placeRespondsTo("open24hours", done);
    });

    it("should tell its additional info to the world", function (done) {
      placeRespondsTo("additionalInfo", done);
    });

    it("should tell its description to the world", function (done) {
      placeRespondsTo("description", done);
    });

    it("should tell its comments to the world", function (done) {
      placeRespondsTo("comments", done);
    });

    it("should tell when it was created to the world", function (done) {
      placeRespondsTo("createdAt", done);
    });

    it("should tell whether it is approved the world", function (done) {
      placeRespondsTo("isApproved", done);
    });

    function placeRespondsTo(property, done) {
      Place.findOne({
        name: test.fixtures.places.pharmacy.name
      }, function (err, place) {
        should.notEqual(place[property], undefined);
        done();
      });
    }
  });
});