const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ['local', 'google'],
    required: true,
  },
  localUser: {
    email: {
      type: String,
      lowercase: true,
    },
    password: {
      type: String,
    },
  },
  googleUser: {
    idd: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
    },
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
