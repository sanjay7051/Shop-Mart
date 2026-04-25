import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../db.js';

const generateToken = (id, role, isAdmin) => {
  return jwt.sign({ id, role, isAdmin }, process.env.JWT_SECRET || 'supersecretkey', {
    expiresIn: '30d',
  });
};

export const registerUser = async (req, res) => {
  console.log('REGISTER BODY:', req.body);
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    console.error('Registration failed: Missing required fields');
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.error('Registration failed: User already exists');
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password using bcrypt before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Save user using mongoose model
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    const savedUser = await user.save();

    console.log('USER SAVED:', savedUser);

    // Return success response with created user (without password)
    res.status(201).json({
      token: generateToken(savedUser._id, savedUser.role, savedUser.isAdmin),
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        isAdmin: savedUser.isAdmin
      }
    });
  } catch (error) {
    console.error('Error saving user to DB:', error);
    res.status(500).json({ message: error.message || 'Error saving user to database' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log('LOGIN USER:', user ? `Found user: ${user.email}` : 'Not found in DB');
    
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        token: generateToken(user._id, user.role, user.isAdmin),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isAdmin: user.isAdmin
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
