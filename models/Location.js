const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    latitude: {
      type: Number,
      required: true,
      alias: 'lat'
    },
    longitude: {
      type: Number,
      required: true,
      alias: 'lng'
    },
    ward: {
      type: String
    },
    district: {
      type: String
    },
    address: {
      type: String
    },
    type: {
      type: String
    },
    method: {
      type: String
    },
    number_of_ads: { //number of ads
      type: Number
    },
    images: [
      {
        type: String
      }
    ],
    accepted: {
      type: Boolean,
      default: false
    }
  },
  {
    collection: 'locations',
    virtuals: {
      id: {
        get() {
          return this._id;
        }
      }
    },
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

//Export the model
module.exports = mongoose.model('Location', locationSchema);
