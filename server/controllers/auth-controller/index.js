const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const signup = async (req, res) => {
  try {
    console.log("Signup endpoint hit");
    console.log("Request body:", req.body);
    
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.error("MongoDB is not connected. Connection state:", mongoose.connection.readyState);
      return res.status(500).json({
        success: false,
        message: "Database connection error. Please try again later.",
      });
    }
    
    const { name, email, password, role } = req.body;
    console.log("Signup request received:", { name, email, role: role || "student" });

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      role: role || "student",
      password: hashedPassword,
    });

    console.log("Saving user to database...");
    await user.save();
    console.log("User saved successfully:", user._id);

    // Generate JWT
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables");
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '120m' }
    );

    console.log("Sending success response");
    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    console.error("Error stack:", err.stack);
    console.error("Error name:", err.name);
    console.error("Error code:", err.code);
    console.error("Error message:", err.message);
    
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message).join(', ');
      return res.status(400).json({
        success: false,
        message: messages || "Validation error",
      });
    }

    // Handle duplicate key error (unique constraint)
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Handle MongoDB connection errors
    if (err.name === 'MongoServerError' || err.message?.includes('Mongo')) {
      return res.status(500).json({
        success: false,
        message: "Database connection error. Please try again later.",
      });
    }

    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '120m' }
    );

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  signup,
  login,
};