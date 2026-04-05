require('dotenv').config();
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const email = process.argv[2] || process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.argv[3] || process.env.ADMIN_PASSWORD || 'StrongPassword123';
  const name = process.argv[4] || process.env.ADMIN_NAME || 'Admin';

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log(`Admin already exists: ${email}`);
    process.exit(0);
  }

  const admin = new Admin({ email, password, name });
  await admin.save();
  console.log(`Created admin: ${email}`);
  process.exit(0);
}

run().catch((err) => {
  console.error('Error creating admin:', err);
  process.exit(1);
});
