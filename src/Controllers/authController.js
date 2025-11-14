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
    const token = jwt.sign({ id: user._id,email: user.email ,role: user.role}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    return res.cookie('token', token, { httpOnly: true }).status(200).json({ message: 'Login successful', user, token });
})



module.exports = {
    signup,
    login
}