// test-mongo.js
const mongoose = require('mongoose');
const uri = process.env.MONGO_URI || 'mongodb+srv://raval3250_db_user:raval3250_db_user@cluster0.ibuhevz.mongodb.net/?appName=Cluster0';
mongoose.connect(uri)
  .then(()=> { console.log('Connected to MongoDB'); process.exit(0); })
  .catch(err => { console.error('Connection error:', err.message || err); process.exit(1); });