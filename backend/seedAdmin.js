require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function run() {
  await connectDB();
  const email = process.env.ADMIN_EMAIL || 'admin@yopmail.com';
  const password = process.env.ADMIN_PASSWORD || 'Password123!';
  const name = process.env.ADMIN_NAME || 'Admin';

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin user already exists:', email);
    process.exit(0);
  }

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  const user = new User({ name, email, password: hashed, role: 'admin' });
  await user.save();
  console.log('Admin user created:', email);
  console.log('Password:', password);
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
