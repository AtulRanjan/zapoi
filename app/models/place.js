/**
 * Module dependencies.
 */

var utils = require('../utils/utils'),
   mongoose = require('mongoose'),
   Schema = mongoose.Schema;

/**
 * Getters
 */

var getCategories = function (categories) {
   return categories.join(',');
}

/**
 * Setters
 */

var setCategories = function (categories) {
   return categories.split(',');
}

/**
 * Place schema
 */
var Place = new Schema({
   name: {
      type: String,
      trim: true
   },
   location: {
      lat: {
         type: Number
      },
      lng: {
         type: Number
      }
   },
   address: {
      type: String
   },
   categories: {
      type: [],
      get: getCategories,
      set: setCategories
   },
   description: {
      type: String,
      default: '',
      trim: true
   },
   comments: [{
      body: {
         type: String,
         default: ''
      },
      user: {
         type: Schema.ObjectId,
         ref: 'User'
      },
      createdAt: {
         type: Date,
         default: Date.now
      }
   }],
   workingHours: [
      new Schema({
         opens: String,
         closes: String
      }, {
         _id: false
      })
   ],
   open24hours: {
      type: Boolean,
      default: false
   },
   imagePath: {
      type: String
   },
   additionalInfo: {
      priceLevel: {
         type: Number
      },
      website: {
         type: String
      },
      phone: {
         type: String
      },
      wifi: {
         type: Boolean,
         default: false
      },
      seats: {
         type: Number
      },
      parking: {
         type: Boolean,
         default: false
      }
   },
   createdAt: {
      type: Date,
      default: Date.now
   },
   isApproved: {
      type: Boolean,
      default: false
   }
}, {
   id: false
});


Place.index({
   location: '2d'
});

/**
 * Delete the image associated with a place (if it exists)
 * before removing the place.
 */
Place.pre('remove', function (next) {
   if (this.imagePath) {
      var fullImagePath = '';
      fs.unlink(fullImagePath, function () {
         if (err) throw err;
      });
   }

   next();
})

/**
 * Instance methods
 */
Place.methods = {

   /**
    * Save place and move uploaded image (if present) from its
    * temp directory to the public uploads dir
    *
    * @param {Object} image
    * @param {Function} callback
    */
   saveWithImage: function (image, callback) {
      if (!image) {
         return this.save(callback);
      }

      // get the temporary location of the file
      var tmp_path = image.path;

      // set where the file should actually exists - in this case it is in the
      // public uploads directory
      var imageName = Date.now() + image.name;
      var target_path = './public/images/uploads/' + imageName;

      var self = this;
      // move the file from the temporary location to the intended location
      utils.copyFile(tmp_path, target_path, function (err) {
         if (err) throw err;
         self.imagePath = imageName;
         self.save(callback);
      });
   }
}

Place.set('toJSON', {
   getters: true,
   virtuals: true
});

module.exports = mongoose.model('Place', Place);