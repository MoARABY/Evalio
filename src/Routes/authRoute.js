const {signup,login}=require('../Controllers/authController');
const {createUserValidator,}=require('../Validators/userValidator');
const router = require('express').Router();

router.post('/signup',createUserValidator,signup);
router.post('/login',login);

module.exports = router;