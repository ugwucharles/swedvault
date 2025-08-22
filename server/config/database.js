const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sweedbit_insurance', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Create indexes for better performance
    await mongoose.connection.db.collection('users').createIndex({ email: 1 });
    await mongoose.connection.db.collection('policies').createIndex({ policyNumber: 1 });
    await mongoose.connection.db.collection('claims').createIndex({ claimNumber: 1 });
    
    console.log('✅ Database indexes created');
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('\n💡 To fix this:');
    console.log('   1. Install MongoDB locally, or');
    console.log('   2. Use MongoDB Atlas (cloud) - see SETUP.md for instructions');
    console.log('   3. Create a .env file with your MONGODB_URI');
    console.log('\n🔄 Retrying connection in 5 seconds...');
    
    // Retry connection after 5 seconds
    setTimeout(() => {
      console.log('🔄 Retrying MongoDB connection...');
      connectDB();
    }, 5000);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB Disconnected');
  } catch (error) {
    console.error('❌ MongoDB disconnection error:', error.message);
  }
};

module.exports = { connectDB, disconnectDB };
