// src/app.js
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const config = require('./config/config');
const errorHandler = require('./middlewares/errorHandler');

// Routes
const routes = require('./routes');
const { swaggerUi, specs } = require('./swagger/swagger');
const app = express();

// ---------- Global Middlewares ----------
app.use(helmet()); // security headers
app.use(cors());   // enable CORS
app.use(morgan('dev')); // logging
app.use(express.json()); // parse JSON requests

// ---------- Health Check ----------
app.get('/health', (req, res) => {
  res.json({ ok: true, env: config.nodeEnv, uptime: process.uptime() });
});
// swagger docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));

// ---------- API Routes ----------
app.use('/api', routes);

// ---------- Error Handling ----------
app.use(errorHandler);

module.exports = app;
