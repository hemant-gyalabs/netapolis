/**
 * Neopolis Infra Dashboard Server
 * Main entry point
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');

const { PORT, DB_URI, NODE_ENV, CORS_ORIGIN } = require('./config/config');

// Import routes
const authRoutes = require('./routes/auth.routes');
const scoreRoutes = require('./routes/score.routes');
// We'll add these routes later when implemented
// const userRoutes = require('./routes/user.routes');
// const projectRoutes = require('./routes/project.routes');
// const dashboardRoutes = require('./routes/dashboard.routes');

// Initialize express app
const app = express();

// Connect to MongoDB
mongoose.connect(DB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  });

// Middleware
app.use(helmet());
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));
app.use(morgan(NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/scores', scoreRoutes);
// We'll add these routes later when implemented
// app.use('/api/users', userRoutes);
// app.use('/api/projects', projectRoutes);
// app.use('/api/dashboard', dashboardRoutes);

// Serve static files from the React app in production
if (NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    ...(NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
});