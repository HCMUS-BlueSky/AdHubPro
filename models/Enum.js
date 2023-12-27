const mongoose = require('mongoose');

const enumSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    values: [
      {
        type: String,
        trim: true
      }
    ]
  },
  {
    collection: 'enums',
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
module.exports = mongoose.model('Enum', enumSchema);
