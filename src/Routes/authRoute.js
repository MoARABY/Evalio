const {signup,login,logout,loggedUserProfile,updateLoggedUser,changeLoggedUserPassword,forgotPassword,verifyResetCode,resetPassword}=require('../Controllers/authController')
const {verifyToken}=require('../Middlewares/verifyToken')
const {createUserValidator,updateUserValidator,changeLoggedUserPasswordValidator}=require('../Validators/userValidator')
const router = require('express').Router()

router.post('/signup',createUserValidator,signup);
router.post('/login',login);
router.post('/logout',verifyToken,logout);
router.get('/profile',verifyToken,loggedUserProfile);
router.put('/',verifyToken,updateUserValidator,updateLoggedUser);
router.put('/changePassword',verifyToken,changeLoggedUserPasswordValidator,changeLoggedUserPassword);
router.post('/forgotPassword',forgotPassword);
router.post('/verifyCode',verifyResetCode);
router.post('/resetPassword',resetPassword);

module.exports = router;