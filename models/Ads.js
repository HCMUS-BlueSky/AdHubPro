const mongoose = require('mongoose');

const adsSchema = new mongoose.Schema(
  {
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      required: true
    },
    type: {
      type: String,
      enum: [
        'Trụ bảng hiflex',
        'Trụ màn hình điện tử LED',
        'Trụ hộp đèn',
        'Bảng hiflex ốp tường',
        'Màn hình điện tử ốp tường',
        'Trụ treo băng rôn dọc',
        'Trụ treo băng rôn ngang',
        'Trụ/Cụm pano',
        'Cổng chào',
        'Trung tâm thương mại'
      ]
    },
    size: {
      type: String
    },
    images: [
      {
        type: String
      }
    ],
    effective: {
      type: Date
    },
    expiration: {
      type: Date
    }
  },
  {
    collection: 'ads',
    virtuals: {
      id: {
        get() {
          return this._id;
        }
      }
    },
    statics: {
      getAvailableType() {
        return this.schema.path('type').enumValues;
      }
    },
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

//Export the model
module.exports = { adsSchema, Ads: mongoose.model('Ads', adsSchema) };
