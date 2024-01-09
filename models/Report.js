const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Điểm đặt quảng cáo', 'Bảng quảng cáo'],
      required: true
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      required: true
    },
    ads: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ads'
    },
    content: {
      type: String,
      trim: true
    },
    method: {
      type: String,
      required: true
    },
    reporter: {
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
      }
    },
    images: [
      {
        type: String,
        trim: true
      }
    ],
    status: {
      type: String,
      enum: ['pending', 'processing', 'done'],
      default: 'pending'
    },
    response: {
      type: String,
      trim: true
    }
  },
  {
    collection: 'reports',
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
module.exports = mongoose.model('Report', reportSchema);
