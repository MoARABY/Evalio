const userModel = require('../../DB/Models/userModel');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


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



module.exports = {
    signup,
    login,
    logout,
    loggedUserProfile,
    updateLoggedUser,
    changeLoggedUserPassword
}