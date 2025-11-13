const validatorMiddleware = require('../Middlewares/validatorMiddleware')
const userModel = require('../../DB/Models/userModel');
const { check } = require('express-validator');



const createUserValidator = [
check('username').notEmpty().withMessage('Username is required'),

check('email')
.notEmpty().withMessage('Email is required')
.isEmail().withMessage('Valid email is required')
.custom(async (email) => {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) throw new Error('Email already in use')
        return true;
}),


check('confirmPassword').notEmpty().withMessage('Please provide a confirm password'),

check('password').notEmpty().withMessage('Password is required')
.isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
.custom((val,{req})=>{
    if(val !== req.body.confirmPassword) throw new Error('Password and confirm password do not match')
    return true
}),

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
    UserIdValidator
}