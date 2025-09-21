// src/services/authService.js
const crypto = require('crypto');
const { hashPassword, comparePassword } = require('../utils/hash');
const { 
  signAccessToken, 
  signRefreshToken, 
  verifyRefreshToken 
} = require('../utils/token');
const { sendMail } = require('../utils/email');
const config = require('../config/config');
const User = require("../models/user");

// Helper to generate random token
function genToken() {
  return crypto.randomBytes(20).toString('hex');
}

// 1. Register + verification link
async function register({ fullName, email, password }) {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('Email already in use');
    err.status = 409;
    throw err;
  }

  const passwordHash = await hashPassword(password);
  const verificationToken = genToken();

  const created = await User.create({
    fullName,
    email,
    password: passwordHash,
    role: 'user',
    isVerified: false,
    verificationToken,
    createdAt: new Date(),
  });

  const link = `${config.baseUrl}/api/auth/verify?token=${verificationToken}`;
  const html = `<p>Hi ${fullName},</p>
    <p>Please verify your email:</p>
    <a href="${link}">${link}</a>`;

  await sendMail({ to: email, subject: 'Verify your email', html });

  return { id: created._id, email: created.email };
}

// 2. Verify email
async function verifyEmail(token) {
  const user = await User.findOne({ verificationToken: token });
  console.log('===',!user)
  if (!user) {
    const err = new Error('Invalid or expired verification token');
    err.status = 400;
    throw err;
  }

  return User.findByIdAndUpdate(
    user._id,
    { isVerified: true, verificationToken: null },
    { new: true }
  );
}

// 3. Login
async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }

  const ok = await comparePassword(password, user.password);
  if (!ok) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }

  if (!user.isVerified) {
    const err = new Error('Email not verified');
    err.status = 403;
    throw err;
  }

  if (!user.isActive) {
    const err = new Error('Account is not active');
    err.status = 403;
    throw err;
  }

  if (user.isBlacklisted) {
    const err = new Error('Account is blacklisted');
    err.status = 403;
    throw err;
  }

  const accessToken = signAccessToken({ id: user._id.toString(), role: user.role });
  const refreshToken = signRefreshToken({ id: user._id.toString(), role: user.role });

  // Save tokens 
  user.accessToken = accessToken;
  user.refreshToken = refreshToken;
  await user.save();

  return {
    accessToken,
    refreshToken,
    user: { id: user._id, fullName: user.fullName, email: user.email },
  };
}

// 4. Resend verification email
async function resendVerification(email) {
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  if (user.isVerified) {
    const err = new Error('Email already verified');
    err.status = 400;
    throw err;
  }

  const newToken = genToken();
  user.verificationToken = newToken;
  await user.save();

  const link = `${config.baseUrl}/api/auth/verify?token=${newToken}`;
  const html = `<p>Hi ${user.fullName},</p>
    <p>Please verify your email:</p>
    <a href="${link}">${link}</a>`;

  await sendMail({ to: user.email, subject: 'Verify your email', html });
  return { message: 'Verification email resent' };
}

// 5. Forgot password
async function forgotPassword(email) {
  const user = await User.findOne({ email });
  if (!user) return; // silent for security

  const resetToken = genToken();
  const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1h

  user.resetToken = resetToken;
  user.resetExpiry = resetExpiry;
  await user.save();

  const link = `${config.baseUrl}/api/auth/reset-password?token=${resetToken}`;
  const html = `<p>Hi ${user.fullName},</p>
    <p>Reset your password (expires in 1h):</p>
    <a href="${link}">${link}</a>`;

  await sendMail({ to: user.email, subject: 'Reset your password', html });
}

// 6. Reset password
async function resetPassword(token, newPassword) {
  const user = await User.findOne({ resetToken: token });
  if (!user || !user.resetExpiry || user.resetExpiry < new Date()) {
    const err = new Error('Invalid or expired reset token');
    err.status = 400;
    throw err;
  }

  user.password = await hashPassword(newPassword);
  user.resetToken = null;
  user.resetExpiry = null;
  await user.save();

  return { message: 'Password updated' };
}

// 7. Refresh tokens
async function refreshTokens(refreshToken) {
  try {
    verifyRefreshToken(refreshToken);

    const user = await User.findOne({ refreshToken });
    if (!user) {
      const err = new Error('Invalid refresh token');
      err.status = 401;
      throw err;
    }

    const newAccessToken = signAccessToken({ id: user._id.toString(), role: user.role });
    const newRefreshToken = signRefreshToken({ id: user._id.toString(), role: user.role });

    user.refreshToken = newRefreshToken;
    await user.save();

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch {
    const err = new Error('Invalid or expired refresh token');
    err.status = 401;
    throw err;
  }
}

// 8. Logout
async function logout(userId, refreshToken) {
  const user = await User.findById(userId);
  if (!user || user.refreshToken !== refreshToken) {
    const err = new Error('Invalid token');
    err.status = 401;
    throw err;
  }

  user.refreshToken = null;
  await user.save();

  return { success: true };
}

module.exports = {
  register,
  verifyEmail,
  login,
  resendVerification,
  forgotPassword,
  resetPassword,
  refreshTokens,
  logout,
};
