const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // No two users can have the same email
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'recruiter'], // Only these two values allowed
    default: 'student',
  },
  // Profile Fields (Mainly for Students)
  skills: {
    type: [String], // Array of strings e.g. ["React", "Node"]
    default: [],
  },
  resume: {
    type: String, // We will store the file path/URL here
    default: "",
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt times
});

module.exports = mongoose.model('User', userSchema);