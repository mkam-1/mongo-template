const express = require("express");
const authRoutes = require("./public/auth/index");
const adminPostRoutes = require("./private/admin/post");
const userPostRoutes = require("./private/user/post");
const authenticate = require("../middlewares/authenticate");
const authorize = require('../middlewares/authorize');

const router = express.Router();

// Public routes (no auth required)
router.use("/auth", authRoutes);

// User-only routes
router.use("/posts", authenticate, userPostRoutes);

// Admin-only routes
router.use("/admin", authenticate, authorize("admin"), adminPostRoutes);

module.exports = router;
