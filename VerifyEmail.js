const userModel = require('../models/UserModel');

const verifyEmailController = async (_req, _res) => {
  try {
    const { token } = _req.query;

    // Find user with the matching token
    const user = await userModel.findOne({ verificationToken: token });

    if (!user) {
      return _res.status(400).send({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    // Mark user as verified
    user.isVerified = true;
    user.verificationToken = undefined; 
    await user.save();

    _res.status(200).send({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    console.log(error);
    _res.status(500).send({
      success: false,
      message: 'Error in email verification',
      error,
    });
  }
};

module.exports = { verifyEmailController };
