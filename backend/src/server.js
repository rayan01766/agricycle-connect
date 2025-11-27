const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const wasteRoutes = require('./routes/waste');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// CORS Configuration - Allow multiple origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://agricycle-connect.vercel.app',
  process.env.CORS_ORIGIN
].filter(Boolean);

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : [];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman / server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);  // 👍 Allowed
    } else {
      console.log("❌ Blocked by CORS:", origin);
      callback(new Error("Blocked by CORS")); // 👈 Real protection
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/waste', wasteRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'AgriCycle Connect API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    cors: {
      configured: true,
      allowedOrigins: allowedOrigins
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS Origins: ${allowedOrigins.join(', ')}`);
});

module.exports = app;