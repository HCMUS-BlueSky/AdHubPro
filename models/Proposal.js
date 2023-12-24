const mongoose = require('mongoose');
const { adsSchema } = require('./Ads')
const { locationSchema } = require('./Location');

const proposalSchema = new mongoose.Schema(
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
      ref: 'Ads',
      required: function () {
        return this.type == 'Bảng quảng cáo';
      }
    },
    status: {
      type: String,
      enum: ['pending', 'rejected', 'accepted'],
      default: 'pending'
    },
    content: {
      type: String,
      required: true
    },
    updated_location: {
      _id: false,
      type: locationSchema,
      required: function () {
        return this.type == 'Điểm đặt quảng cáo';
      }
    },
    updated_ads: {
      _id: false,
      type: adsSchema,
      required: function () {
        return this.type == 'Bảng quảng cáo';
      }
    }
  },
  {
    collection: 'proposals',
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
module.exports = mongoose.model('Proposal', proposalSchema);
