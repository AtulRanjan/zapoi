var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
  name: String,
  email: String,
  likedPlaces: [{
    type: Schema.ObjectId,
    ref: 'Place'
  }]
});

User.methods = {

  likePlace: function (place, cb) {
    this.likedPlaces.push(place);
    this.save(cb);
  },

  dislikePlace: function (placeId, cb) {
    var index = this.likedPlaces.indexOf(placeId);
    if (~index) {
      this.likedPlaces.splice(index, 1);
      this.save(cb);
    } else {
      return cb('Place not found');
    }
  }
}

User.plugin(passportLocalMongoose, {
  usernameField: 'email'
});
module.exports = mongoose.model('User', User);