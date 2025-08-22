const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const policyRoutes = require('./routes/policies');
const claimRoutes = require('./routes/claims');
const dashboardRoutes = require('./routes/dashboard');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Sweedbit Insurance API Server is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      policies: '/api/policies',
      claims: '/api/claims',
      dashboard: '/api/dashboard'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Sweedbit Insurance API Server is running on port ${PORT}`);
  console.log(`📖 API Documentation: http://localhost:${PORT}`);
  console.log(`🌐 Health Check: http://localhost:${PORT}/`);
  console.log('\n📋 Available Endpoints:');
  console.log('   🔐 Authentication: /api/auth');
  console.log('   👥 Users: /api/users');
  console.log('   📋 Policies: /api/policies');
  console.log('   📋 Claims: /api/claims');
  console.log('   📊 Dashboard: /api/dashboard');
  console.log('\n💡 To seed the database, run: npm run seed');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});
