const validatorMiddleware = require('../Middlewares/validatorMiddleware')
const userModel = require('../../DB/Models/userModel');
const { check } = require('express-validator');
const bcrypt = require('bcrypt');



const createUserValidator = [
check('username').notEmpty().withMessage('Username is required'),

// check email validity and uniqueness
check('email')
.notEmpty().withMessage('Email is required')
.isEmail().withMessage('Valid email is required')
.custom(async (email) => {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) throw new Error('Email already in use')
        return true;
}),

// check confirm password presence
check('confirmPassword').notEmpty().withMessage('Please provide a confirm password'),

check('password').notEmpty().withMessage('Password is required')
.isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
.custom((val,{req})=>{
    if(val !== req.body.confirmPassword) throw new Error('Password and confirm password do not match')
    return true
}),

// check phone validity and uniqueness
check('phone')
.notEmpty().withMessage('Phone number is required')
.isMobilePhone([ 'ar-EG', 'en-US' ]).withMessage('Valid phone number is required')
.custom(async (phone) => {
    const existingUser = await userModel.findOne({ phone });
    if (existingUser) throw new Error('Phone number already in use')
})
,validatorMiddleware
]

const updateUserValidator = [
check('email').optional()
.isEmail().withMessage('Valid email is required')
.custom(async (email,{req}) => {
    const existingUser = await userModel.findOne({ email , _id: { $ne: req.params.id } });
    if (existingUser) throw new Error('Email already in use')
        return true;
}),

check('phone').optional()
.isMobilePhone([ 'ar-EG', 'en-US' ]).withMessage('Valid phone number is required')
.custom(async (phone,{req}) => {
    const existingUser = await userModel.findOne({ phone , _id: { $ne: req.params.id } });
    if (existingUser) throw new Error('Phone number already in use')
        return true;
})

,validatorMiddleware
]

const changePasswordValidator = [
check('currentPassword').notEmpty().withMessage('Current password is required')
.custom(async (val,{req})=>{
    const user = await userModel.findById(req.params.id);
    if(!user) throw new Error('User not found')
    const compare = await bcrypt.compare(val, user.password);
    if(!compare) throw new Error('Current password is incorrect')
    return true
}),

check('password').notEmpty().withMessage('New password is required')
.isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),

check('confirmPassword').notEmpty().withMessage('Please provide a confirm password')
.custom((val,{req})=>{
    if(val !== req.body.password) throw new Error('Password and confirm password do not match')
    return true
})

,validatorMiddleware
]

const changeLoggedUserPasswordValidator = [
check('currentPassword').notEmpty().withMessage('Old password is required')
.custom(async (val,{req})=>{
    const user = await userModel.findById(req.user._id);
    if(!user) throw new Error('User not found')
        console.log(user);
    const compare = await bcrypt.compare(val, user.password);
    if(!compare) throw new Error('Old password is incorrect')
    return true
}),

check('password').notEmpty().withMessage('New password is required')
.isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
check('confirmPassword').notEmpty().withMessage('Please provide a confirm password')
.custom((val,{req})=>{
    if(val !== req.body.password) throw new Error('Password and confirm password do not match')
    return true
})
,validatorMiddleware
]

const UserIdValidator = [
    check('id').isMongoId().withMessage('Invalid user ID format')
    .custom(async (id) => {
        const user = await userModel.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
    return true;
    })
        
    ,validatorMiddleware
]


module.exports = {
    createUserValidator,
    updateUserValidator,
    changePasswordValidator,
    UserIdValidator,
    changeLoggedUserPasswordValidator
}