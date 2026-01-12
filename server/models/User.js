const mongoose = require("mongoose");

// There are redundant fields in your schema definition.
// You define both `userName`/`name`, `userEmail`/`email`, `password` (twice), and `role` (twice).

// Cleaned up version:

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "instructor", "admin"],
    default: "student",
  },
});

module.exports = mongoose.model("User", UserSchema);