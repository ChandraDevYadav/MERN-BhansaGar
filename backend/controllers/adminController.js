import jwt from 'jsonwebtoken';
import Admin from '../models/adminModel.js';
import dotenv from 'dotenv';
const bcrypt = require('bcryptjs');


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Register a new admin
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Admin already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin
    const newAdmin = new Admin({ name, email, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ success: true, message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Login an admin
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Create and assign a JWT
    const token = jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
