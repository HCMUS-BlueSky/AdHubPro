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
      images: [
        {
          type: String
        }
      ],
      accepted: {
        type: Boolean,
        default: false
      },
      
      company_name: {
        type: String
      },

      company_code: {
        type: String
      },

      company_address: {
        type: String
      },

      company_email: {
        type: String
      },

      company_phone: {
        type: String
      },

      description: {
        type: String
      },
      start_date: {
        type: String
      },
      end_date: {
        type: String
      },
    advertiser: {
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
    effective_date: {
      type: Date
    },
    expire_date: {
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
