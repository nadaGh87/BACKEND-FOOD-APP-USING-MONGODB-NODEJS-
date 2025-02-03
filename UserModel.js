const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, 'user name is required'],
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'password is required'],
  },
  adresse: {
    type: Array,
  },
  phone: {
    type: String,
    required: [true, 'phone number is required'],
  },
  userType: {
    type: String,
    required: [true, 'user type is required'],
    default: 'client',
    enum: ['client', 'admin', 'vendor', 'driver'],
  },
  profile: {
    type: String,
    default: 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png',
  },
  answer: {
    type: String,
    required: [false, 'Answer is required'], 
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },

}, { timestamps: true }); 

module.exports = mongoose.model('User', userSchema);
