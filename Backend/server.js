const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const { configureCloudinary, testCloudinaryConnection } = require('./config/cloudinary');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Configure Cloudinary
if (configureCloudinary()) {
  // Test Cloudinary connection
  testCloudinaryConnection().then(isConnected => {
    if (isConnected) {
      console.log('🚀 Cloudinary ready for image uploads');
    } else {
      console.warn('⚠️ Cloudinary connection failed - image uploads may not work');
    }
  });
} else {
  console.warn('⚠️ Cloudinary not configured - image uploads will not work');
}

const app = express();

// Middleware
const corsOptions = {
  origin: [
    "http://127.0.0.1:5500", 
    "http://localhost:5500",
    "https://wastelessappignitionhacks-1.onrender.com",
    "https://wastelessappignitionhacks-1.onrender.com/",
    "https://wastelessappignitionhacks-website.onrender.com",
    "https://wastelessappignitionhacks-website.onrender.com/",
    "https://wastelessappignitionhacks-backend.onrender.com",
    "https://wastelessappignitionhacks-backend.onrender.com/"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/food', require('./routes/foodRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// Serve static files from the Frontend directory
const frontendPath = path.join(__dirname, '../Frontend');
app.use(express.static(frontendPath));

// Handle SPA (Single Page Application) routing
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    message: 'Wasteless API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint - Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to Wasteless API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      food: '/api/food',
      chat: '/api/chat',
      health: '/api/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({ message: messages.join(', ') });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ message: `${field} already exists` });
  }

  res.status(500).json({ message: 'Server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API URL: http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('Unhandled Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Close server & exit process
  process.exit(1);
});