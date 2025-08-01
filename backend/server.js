const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();

// Trust proxy - this is crucial for serverless/proxy environments
app.set('trust proxy', true);

connectDB();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  // Optional: Add custom key generator if needed
  keyGenerator: (req) => {
    return req.ip; // This will now correctly use the forwarded IP
  }
});
app.use(limiter);

// CORS configuration - THIS WAS MISSING!
app.use(cors({
  origin: [
    'https://hask-ai.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL || 'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  optionsSuccessStatus: 200 // For legacy browser support
}));

// Add explicit OPTIONS handler for preflight requests
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/image', require('./routes/image'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

// For serverless deployment (Vercel), export the app
module.exports = app;
  // For local development
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
