const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const config = require('./config/config');
const errorHandler = require('./middlewares/errorHandler');
const morganMiddleware = require('./middlewares/logger'); // <-- new
const { swaggerUi, specs } = require('./swagger/swagger');

const routes = require('./routes');
const app = express();

// ---------- Global Middlewares ----------
app.use(helmet()); // security headers
app.use(cors());   // enable CORS
app.use(morganMiddleware); //  Morgan + Winstonlogging
app.use(express.json()); // parse JSON requests

// ---------- Health Check ----------
app.get('/health', (req, res) => {
  res.json({ ok: true, env: config.nodeEnv, uptime: process.uptime() });
});

// Swagger docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));

// ---------- API Routes ----------
app.use('/api', routes);

// ---------- Error Handling ----------
app.use(errorHandler);

module.exports = app;
