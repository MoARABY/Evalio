const {createUser,getAllUsers,getUserById,updateUser,updateUserPassword,deleteUser} = require('../Controllers/userController')
const {createUserValidator,updateUserValidator,changePasswordValidator,UserIdValidator} = require('../Validators/userValidator')
const verifyToken = require('../Middlewares/verifyToken')
const router = require('express').Router()

// no verify token in get all users controller to check if token logic work
router.route('/').get(getAllUsers).post(createUserValidator, createUser)
router.route('/:id').get(verifyToken, UserIdValidator, getUserById).put(verifyToken, UserIdValidator, updateUserValidator, updateUser).delete(verifyToken, UserIdValidator, deleteUser)
router.route('/:id/password').put(verifyToken, UserIdValidator, changePasswordValidator, updateUserPassword)

module.exports = router 