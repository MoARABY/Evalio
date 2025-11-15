const userModel = require('../../DB/Models/userModel');
const sendEmails = require('../Utils/sendEmails')
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto')


const signup = asyncHandler(async (req, res) => {
    const user = await userModel.create(req.body);
    const {password,...others} = user._doc
    user ? res.status(201).json({msg:'user created successfully',others}) : res.status(400).json({msg:'user not created'})
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).json('all fields are required')
    const user = await userModel.findOne({ email });
    if(!user || ! await bcrypt.compare(password,user.password)) {
        return res.status(400).json('Invalid email or password')
    }
    if(!user.isActive) {
        return res.status(403).json({status:'fail',msg:'you are suspended please call the admin'})
    }
    const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    return res.cookie('authorization', token, { httpOnly: true }).status(200).json({ message: 'Login successful', user });
})

const logout = asyncHandler(async (req, res) => {
    res.clearCookie('authorization').status(200).json({ msg: 'logged out successfully' });
});

const loggedUserProfile = asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.user._id);
    user ? res.status(200).json({ msg: 'user profile', user }) : res.status(404).json({ msg: 'user not found' });
})

const updateLoggedUser = asyncHandler(async(req,res)=>{
    const id = req.user._id;
    const user = await userModel.findByIdAndUpdate(id,
    {
        username:req.body.username,
        email:req.body.email,
        phone:req.body.phone,
        role:req.body.role
    },{new:true})
    user ? res.status(200).json({msg:'user updated successfully',user}) : res.status(404).json({msg:'user not found'})
})

const changeLoggedUserPassword = asyncHandler(async (req, res) => {
    const {password } = req.body;
    const user = await userModel.findById(req.user._id);
    user.password = password;
    user.passwordChangedAt = Date.now();
    await user.save();
    res.status(200).json({ msg: 'password updated successfully' });
});

// build forgot password logic
const forgotPassword = asyncHandler(async(req,res)=>{
    const {email} = req.body

    // check if email is valid
    const user = await userModel.findOne({email})
    if(!user) return res.status(400).json({status:'fail',msg:'invalid user Email'})
    
    // generate random resetCode
    const resetCode = Math.floor(100000 + Math. random() * 900000).toString()
    // hash resetCode
    const HashedRestCode =  crypto.createHash('sha256').update(resetCode).digest('hex')
    user.passwordResetCode = HashedRestCode;
    user.passwordResetCodeExpires = Date.now() + 1000 * 60 * 10; // expires in 10 minutes
    user.passwordResetCodeVerified = false
    await user.save()
    // send Emails By Nodemailer
    try {
        const message = `Hi ${user.username},\n\nwe received a request to reset your password.\nYour password reset code is ${resetCode}. \nIf you did not request this, please ignore this email.`
        await sendEmails({
            // email:user.email,
            email:'devscommunity13@gmail.com',
            subject:'Password Reset Token',
            message
        })
    } catch (error) {
        user.passwordResetCode = undefined;
        user.passwordResetCodeExpires = undefined;
        user.passwordResetCodeVerified = undefined;
        await user.save();
        return res.status(500).json({ msg: 'Error sending email', error: error.message });
    }

    res.status(200).json({ msg: 'Password reset code sent to email' });
})

const verifyResetCode = asyncHandler(async (req,res)=>{
    const {resetCode} = req.body
    const hashedCode = crypto.createHash('sha256').update(resetCode).digest('hex')

    const user = await userModel.findOne({passwordResetCode:hashedCode,passwordResetCodeExpires:{$gt:Date.now()}})
    if(!user) return res.status(404).json('Code Expired or Invalid')

    user.passwordResetCodeVerified = true
    await user.save()
    res.status(200).json({status:'Success',message:'Code Verified'})
})

const resetPassword = asyncHandler(async(req,res)=>{
    const {email,password} = req.body
    const user = await userModel.findOne({email})
    if(!user) return res.status(404).json(`There is no user with email ${email}`)
    if(!user.passwordResetCodeVerified) return res.status(400).json('your code is not verified')
    user.password = password
    user.passwordResetCode = undefined
    user.passwordResetCodeExpires = undefined
    user.passwordResetCodeVerified = undefined
    user.passwordChangedAt = Date.now();
    await user.save()
    const {password:pass,...others} = user._doc
    res.status(200).json({status:'Success',message:'Password Reset Successful',others})
})


module.exports = {
    signup,
    login,
    logout,
    loggedUserProfile,
    updateLoggedUser,
    changeLoggedUserPassword,
    forgotPassword,
    verifyResetCode,
    resetPassword
}