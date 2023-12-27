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
    ads_count: {
      type: Number,
      min: 0,
      default: 0
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

locationSchema.index({
  ward: 'text',
  district: 'text',
  address: 'text',
  type: 'text',
  method: 'text'
});

//Export the model
module.exports = { locationSchema, Location: mongoose.model('Location', locationSchema) };
