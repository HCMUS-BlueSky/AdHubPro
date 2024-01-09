const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      trim: true,
      required: true
    },
    birthdate: {
      type: Date,
      alias: 'dob'
    },
    gender: {
      type: Boolean
    },
    identity_code: {
      type: String
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
    password: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      enum: ['ward_officer', 'district_officer', 'department_officer']
    },
    managed_ward: {
      type: String,
      required: function () {
        return this.role === 'ward_officer';
      }
    },
    managed_district: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'District',
      required: function () {
        return this.role === 'ward_officer' || this.role === 'district_officer';
      }
    }
  },
  {
    collection: 'users',
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

userSchema.index({
  fullname: 'text',
  email: 'text',
  identity_code: 'text',
  phone: 'text',
  role: 'text'
});

//Export the model
module.exports = mongoose.model('User', userSchema);
