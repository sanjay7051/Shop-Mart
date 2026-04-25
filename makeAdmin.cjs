const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function makeAdmin() {
  const email = process.argv[2];

  if (!email) {
    console.error('Please provide an email. Usage: node makeAdmin.cjs <email>');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/luxecommerce');
    console.log('Connected to MongoDB');

    const user = await User.findOneAndUpdate(
      { email },
      { $set: { isAdmin: true, role: 'admin' } },
      { new: true }
    );

    if (user) {
      console.log(`Success! User ${email} is now an ADMIN.`);
    } else {
      console.log(`Error: User with email ${email} not found.`);
    }

  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

makeAdmin();
