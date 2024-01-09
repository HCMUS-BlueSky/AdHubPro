const mongoose = require('mongoose');
const { adsSchema } = require('./Ads')

const requestSchema = new mongoose.Schema(
  {
    ads: {
      _id: false,
      type: adsSchema,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'rejected', 'accepted'],
      default: 'pending'
    },
    description: {
      type: String
    },
    company: {
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
            msg: 'Email không hợp lệ!'
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
            msg: 'Số điện thoại không hợp lệ!'
          }
        ]
      },
      address: {
        type: String,
        required: true,
        trim: true
      }
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
