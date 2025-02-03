const userModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto"); // To generate the verification token

// Register
const registerCntroller = async (_req, _res) => {
  try {
    const { userName, email, password, phone, adresse, answer, userType } = _req.body;

    // Validation
    if (!userName || !email || !password || !phone || !adresse || !answer) {
      return _res.status(500).send({
        success: false,
        message: "Please Provide all Fields",
      });
    }

    // Check if the user already exists
    const existing = await userModel.findOne({ email });
    if (existing) {
      return _res.status(500).send({
        success: false,
        message: "Email already Registered. Please Login.",
      });
    }

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate the verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Default to 'client' or allow the user to specify 'admin' or other roles
    const finalUserType = userType || 'client'; // Set 'client' as the default if no type is provided

    // Create the new user with the specified userType
    const user = await userModel.create({
      userName,
      email,
      password: hashedPassword,
      adresse,
      phone,
      answer,
      userType: finalUserType, // Use the userType passed in the request
      verificationToken,
    });

    _res.status(201).send({
      success: true,
      message: "Registration successful!",
      user,
    });
  } catch (error) {
    console.log(error);
    _res.status(500).send({
      success: false,
      message: "Error in register API",
      error,
    });
  }
};



// Login
const LoginController = async (_req, _res) => {
  try {
    const { email, password } = _req.body;

    // Validation
    if (!email || !password) {
      return _res.status(400).send({
        success: false,
        message: "Please provide both email and password",
      });
    }

    // Check if the user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return _res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Check email verification
    if (!user.isVerified) {
      return _res.status(403).send({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    // Check user password || compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return _res.status(401).send({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Remove the password from the user object to enhance security
    user.password = undefined;

    _res.status(200).send({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    _res.status(500).send({
      success: false,
      message: "Error in login API",
      error,
    });
  }
};

module.exports = { registerCntroller, LoginController };
