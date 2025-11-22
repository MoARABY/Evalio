const userModel = require('../../DB/Models/userModel')
const asyncHandler = require('express-async-handler')
const apiFeatures = require('../Utils/appFeatures')

const createUser = asyncHandler(async (req, res) => {
    const user = await userModel.create(req.body);
    const {password, ...rest} = user._doc;
    user ? res.status(201).json({ message: "User created successfully", body:rest }) : res.status(400).json({ message: "User creation failed" });
})

const getAllUsers = asyncHandler(async (req, res) => {
    const mongooseQuery = userModel.find()
    const features = new apiFeatures(req.query, mongooseQuery)
    .filter()
    .sort()
    .limitFields()
    .search('UserModel')
    .paginate()

    const users = await features.mongooseQuery
    // const users = await userModel.find();
    if(users.length === 0) {
        return res.status(404).json({ message: "No users found" });
    }
    res.json({ message: "users list", users: users });
})

const getUserById = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const user = await userModel.findById(id);
    const {password, ...rest} = user._doc;
    res.status(200).json({ message: "user",rest })
})

const updateUser = asyncHandler(async (req, res) => {
    const {id} = req.params;

    // Proceed to update the user
    const updatedUser = await userModel.findByIdAndUpdate(id, 
    {
        username: req.body.username,
        email:req.body.email,
        phone:req.body.phone,
        role:req.body.role
    }, 
        { new: true , runValidators: true }
    );
    updatedUser ? res.status(200).json({ message: "User updated successfully", user: updatedUser }) : res.status(400).json({ message: "User update failed" });
})

const updateUserPassword = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const user = await userModel.findById(id);
    user.password = req.body.password;
    user.passwordChangedAt = Date.now();
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
})

const withdrawUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    await userModel.findByIdAndDelete(id);
    res.status(200).json({ message: "User withdrawn successfully" });
})

const suspendUser = asyncHandler(async (req, res) => {
    const {id} = req.params
    await userModel.findByIdAndUpdate(id,{isActive:false})
    res.status(200).json({ message: "User suspended successfully" });
})

const unsuspendUser = asyncHandler(async (req, res) => {
    const {id} = req.params
    await userModel.findByIdAndUpdate(id,{isActive:true})
    res.status(200).json({ message: "User unSuspended successfully" });
})

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    updateUserPassword,
    withdrawUser,
    suspendUser,
    unsuspendUser
}