const express = require('express');
require('dotenv').config();

const { corsMiddleware } = require('./middleware/cors');
const contactRoutes = require('./routes/contactRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const studentRoutes = require('./routes/studentRoutes');
const jobRoutes = require('./routes/jobRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(corsMiddleware);
app.use(express.json());

// Base Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Aayup Technologies Backend API',
    timestamp: new Date().toISOString(),
  });
});

// Modular Routes
app.use('/api', contactRoutes);
app.use('/api', enquiryRoutes);
app.use('/api', studentRoutes);
app.use('/api', jobRoutes);
app.use('/api', adminRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found on Aayup Backend API' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Aayup Technologies Backend API is running on port ${PORT}`);
});

module.exports = app;
