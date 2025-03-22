const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Define routes
const authRoutes = require('./routes/auth');
const recommendationsRoutes = require('./routes/recommendations');
const linkedinRoutes = require('./routes/linkedin');
const educationRoutes = require('./routes/education');
const chatbotRoutes = require('./routes/chatbot');

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/recommendations', recommendationsRoutes);
app.use('/api/v1/linkedin', linkedinRoutes);
app.use('/api/v1/education', educationRoutes);
app.use('/api/v1/chatbot', chatbotRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'API is running',
    environment: process.env.NODE_ENV
  });
});

// Error handling middleware
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    status: 'error',
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
