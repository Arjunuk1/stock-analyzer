const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, default: null },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  profilePic: { type: String, default: '' },
  googleId: { type: String, default: null }
});

module.exports = mongoose.model('User', userSchema);
