const authService = require('../services/auth');
const asyncWrapper = require('../utils/asyncWrapper');

exports.register = asyncWrapper(async (req, res) => {
  const out = await authService.register(req.body);
  res.status(201).json({ ok: true, message: 'Check inbox for verification email', data: out });
});

exports.verify = asyncWrapper(async (req, res) => {
  const { token } = req.query;
  try {
    await authService.verifyEmail(token);
    return res.status(200).json({
      ok: true,
      message: 'Email verified successfully',
    });
  } catch (err) {
    return res.status(400).json({
      ok: false,
      message: err.message || 'Email verification failed',
    });
  }
});


exports.login = asyncWrapper(async (req, res) => {
  const out = await authService.login(req.body);
  res.json({ ok: true, data: out });
});

exports.resend = asyncWrapper(async (req, res) => {
  const out = await authService.resendVerification(req.body.email);
  res.json({ ok: true, data: out });
});

exports.forgot = asyncWrapper(async (req, res) => {
  await authService.forgotPassword(req.body.email);
  res.json({ ok: true, message: 'If the email exists, reset link sent' });
});

exports.reset = asyncWrapper(async (req, res) => {
  const { token, password } = req.body;
  const out = await authService.resetPassword(token, password);
  res.json({ ok: true, data: out });
});

exports.refresh = asyncWrapper(async (req, res) => {
  const { refreshToken } = req.body;
  const out = await authService.refreshTokens(refreshToken);
  res.json({ ok: true, data: out });
});

exports.logout = asyncWrapper(async (req, res) => {
  const { refreshToken } = req.body;
  const userId = req.user.id; // extracted from access token
  await authService.logout(userId, refreshToken);
  res.json({ ok: true, message: 'Logged out successfully' });
});
