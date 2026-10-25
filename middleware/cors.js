const cors = require('cors');

const defaultOrigins = [
  'https://www.aayuptechnologies.com',
  'https://aayuptechnologies.com',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

const allowedOrigins = process.env.CORS_ORIGINS
  ? [...new Set([...process.env.CORS_ORIGINS.split(',').map((o) => o.trim()), ...defaultOrigins])]
  : defaultOrigins;

const corsMiddleware = cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

module.exports = { corsMiddleware };
