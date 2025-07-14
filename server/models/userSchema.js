const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

// User Schema definition
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: [validator.isEmail, 'Entered email address not valid!']
  },
  autoEnabled: {
    type: Boolean,
    default: false // Set default to false
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  }
}, {
  timestamps: true // Thêm createdAt và updatedAt
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = function(password) {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
