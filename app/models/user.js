var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    name: String,
    email: String
});

User.plugin(passportLocalMongoose, {
    usernameField: 'email'
});
module.exports = mongoose.model('User', User);