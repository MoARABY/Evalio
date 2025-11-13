const userModel = require('../../DB/Models/userModel');


const createUser = async (req, res) => {
    const user = await userModel.create(req.body);
    user ? res.status(201).json({ message: "User created successfully", body:user }) : res.status(400).json({ message: "User creation failed" });
}

const getAllUsers = async (req, res) => {
    const users = await userModel.find();
    if(users.length === 0) {
        return res.status(404).json({ message: "No users found" });
    }
    res.json({ message: "users list", users: users });
}

const getUserById = async (req, res) => {
    const {id} = req.params;
    const user = await userModel.findById(id);
    user ? res.json({ message: "user found successfully", user: user }) : res.status(404).json({ message: "User not found" });
}

const updateUser = async (req, res) => {
    const {id} = req.params;

    // Proceed to update the user
    const updatedUser = await userModel.findByIdAndUpdate(id, req.body, 
        { new: true , runValidators: true }
    );
    updatedUser ? res.status(200).json({ message: "User updated successfully", user: updatedUser }) : res.status(400).json({ message: "User update failed" });
}

const deleteUser = async (req, res) => {
    const {id} = req.params;
    await userModel.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
}

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
}