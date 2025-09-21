const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    
    // Store hashed password (service takes care of hashing)
    password: { type: String, required: true },

    role: { type: String, enum: ['user', 'admin'], default: 'user' },

    // Verification
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    accessToken: { type: String },

    // Account status
    isActive: { type: Boolean, default: true },
    isBlacklisted: { type: Boolean, default: false },

    // Tokens
    refreshToken: { type: String },
    resetToken: { type: String },
    resetExpiry: { type: Date },

  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
