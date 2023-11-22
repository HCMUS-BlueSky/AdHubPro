const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['location', 'ads'],
      required: true
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location'
    },
    ads: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ads'
    },
    content: { //noi dung bao cao
      type: String
    },
    solution: { //cach thuc xu ly
      type: String
    },
    report_time:{
      type: Date,
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
      }
    },
    images: [
      {
        type: String
      }
    ],
    processed: {
      type: Boolean,
      default: false
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
