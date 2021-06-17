const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    id: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
    },
  },
});

UserSchema.pre('save', async function (next) {
  if (this.method !== 'local') next();
  const salt = await bcrypt.genSalt(10);
  this.local.password = await bcrypt.hash(this.local.password, salt);
});

UserSchema.methods.validatePassword = async function (password) {
  try {
    return await bcrypt.compare(this.password, password);
  } catch (error) {
    console.log(error);
  }
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
