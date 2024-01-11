const mongoose = require('mongoose');

const randLocationSchema = new mongoose.Schema(
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
    address: {
      type: String,
      required: true,
      trim: true
    },
    ward: {
      type: String
    },
    district: {
      type: String
    }
  },
  {
    collection: 'randLocations',
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

randLocationSchema.index({ latitude: 1, longitude: 1 }, { unique: true });

randLocationSchema.index({
  address: 'text',
});

//Export the model
module.exports = mongoose.model('RandLocation', randLocationSchema);
