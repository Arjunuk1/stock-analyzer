const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, default: null },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  profilePic: { type: String, default: '' },
  googleId: { type: String, default: null }
});

// Pre-save hook to hash password
userSchema.pre('save', async function() {
  if (!this.isModified('password') || !this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password || !candidatePassword) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Static method to find or create google user
userSchema.statics.findOrCreateGoogleUser = async function(profile) {
  const { name, email, googleId, profilePic } = profile;
  let user = await this.findOne({ email });

  if (!user) {
    user = await this.create({
      name: name || 'Google User',
      email,
      password: null,
      authProvider: 'google',
      googleId: googleId || null,
      profilePic: profilePic || ''
    });
  } else {
    let changed = false;
    if (!user.authProvider || user.authProvider === 'local') {
      user.authProvider = 'google';
      changed = true;
    }
    if (!user.googleId) {
      user.googleId = googleId || null;
      changed = true;
    }
    if (!user.profilePic && profilePic) {
      user.profilePic = profilePic;
      changed = true;
    }
    if (changed) await user.save();
  }
  return user;
};

module.exports = mongoose.model('User', userSchema);
