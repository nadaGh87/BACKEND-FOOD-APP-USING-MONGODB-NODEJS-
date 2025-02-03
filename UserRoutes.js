
const express = require('express');
const { getUserController, updateUserController, updatePasswordController, resetPasswordController, deleteProfileController, updateEmailController, deactivateUserController, activateUserController, getAllUsersController, changeUserRoleController, resetPasswordWithOldPasswordController, incrementUserProfileViewController } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router()
router.get('/getUser', authMiddleware, getUserController);
//UPDATE PROFILE
router.put('/updateUser', authMiddleware, updateUserController)
//UPDATE PASSWORD
router.post('/updatePassword', authMiddleware, updatePasswordController,)

//RESET PASSWORD 
router.post('/resetPassword', authMiddleware, resetPasswordController);

//delete USER
router.delete('/deleteUser/:id', authMiddleware, deleteProfileController);
module.exports = router;
//UPDATE EMAIL
router.post('/updateEmail', authMiddleware, updateEmailController);
//desactivate User account
router.post('/desactivateUser', authMiddleware, deactivateUserController);
router.post('/ActivateUser', authMiddleware, activateUserController);
router.get('/getAllUsers', authMiddleware, getAllUsersController);

router.post('/ChangeRole', authMiddleware, changeUserRoleController);
router.post('/ChangeRole', authMiddleware, changeUserRoleController);
router.post('/ChangeRole', authMiddleware, changeUserRoleController);
router.post('/resetPasswordWithOldPassword', authMiddleware, resetPasswordWithOldPasswordController);


