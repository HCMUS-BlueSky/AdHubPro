const mongoose = require('mongoose');
const { adsSchema } = require('./Ads')
const { locationSchema } = require('./Location');

const proposalSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['ads', 'location'],
      required: true
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      required: function () {
        return this.type == 'location';
      }
    },
    ads: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ads',
      required: function () {
        return this.type == 'ads';
      }
    },
    content: {
      type: String,
      required: true
    },
    updated_location: {
      type: locationSchema,
      required: function () {
        return this.type == 'location';
      }
    },
    updated_ads: {
      type: adsSchema,
      required: function () {
        return this.type == 'ads';
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
