const express=require('express')
const { registerCntroller, LoginController } = require('../controllers/authController')
const { verifyEmailController } = require('./VerifyEmail')
const router =express.Router()
//routes
//registrer ||POST
router.post('/register',registerCntroller)
//Login and POST 
router.post('/login',LoginController)
router.get('/verify-email', verifyEmailController);


module.exports=router;