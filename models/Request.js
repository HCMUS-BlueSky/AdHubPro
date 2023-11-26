const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
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
      type: String,
      trim: true
    },
    district: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    type: {
      type: String,
      trim: true
    },
    method: {
      type: String,
      trim: true
    },
    images: [
      {
        type: String
      }
    ],
    accepted: {
      type: Boolean,
      default: false
    },
    description: {
      type: String
    },
    advertiser: {
      name: {
        type: String,
        required: true,
        trim: true
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate: [
          {
            validator: (s) =>
              /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(s),
            msg: 'Invalid email'
          }
        ]
      },
      phone: {
        type: String,
        required: true,
        trim: true,
        validate: [
          {
            validator: (p) =>
              /(\+?( |-|\.)?\d{1,2}( |-|\.)?)?(\(?\d{3}\)?|\d{3})( |-|\.)?(\d{3}( |-|\.)?\d{4})/.test(
                p
              ),
            msg: 'Invalid phone number'
          }
        ]
      },
      address: {
        type: String,
        required: true
      }
    },
    effective: {
      type: Date
    },
    expiration: {
      type: Date
    }
  },
  {
    collection: 'requests',
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
module.exports = mongoose.model('Request', requestSchema);
