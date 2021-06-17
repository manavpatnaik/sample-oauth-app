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
  this.localUser.password = await bcrypt.hash(this.localUser.password, salt);
});

UserSchema.methods.validatePassword = async function (password) {
  try {
    const valid = await bcrypt.compare(password, this.localUser.password);
    return valid;
  } catch (error) {
    console.log(error.message);
  }
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
