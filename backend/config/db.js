const mongoose = require('mongoose');

// Prefer explicit MONGO_URI from environment; otherwise use local MongoDB for development
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://raval3250_db_user:abhishek1234@cluster0.ibuhevz.mongodb.net/?appName=Cluster0';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message || err);
    console.error('Ensure MONGO_URI is set in backend/.env or that a local MongoDB is running.');
    process.exit(1);
  }
};

module.exports = connectDB;
