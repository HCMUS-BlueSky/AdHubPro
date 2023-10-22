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
