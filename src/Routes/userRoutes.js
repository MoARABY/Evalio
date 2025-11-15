const {createUser,getAllUsers,getUserById,updateUser,updateUserPassword,withdrawUser,suspendUser,unsuspendUser} = require('../Controllers/userController')
const {createUserValidator,updateUserValidator,changePasswordValidator,UserIdValidator} = require('../Validators/userValidator')
const {allowedTo} = require('../Middlewares/verifyToken')
const router = require('express').Router()

// no verify token in get all users controller to check if token logic work
router.route('/').get(getAllUsers).post(allowedTo('Admin'), createUserValidator, createUser)
router.route('/:id').get(allowedTo('Admin'), UserIdValidator, getUserById).put(allowedTo('Admin'), UserIdValidator, updateUserValidator, updateUser).delete(allowedTo('Admin'), UserIdValidator, withdrawUser)
router.route('/:id/password').put(allowedTo('Admin'), UserIdValidator, changePasswordValidator, updateUserPassword)
router.route('/:id/suspend').put(allowedTo('Admin'), UserIdValidator, suspendUser)
router.route('/:id/unsuspend').put(allowedTo('Admin'), UserIdValidator, unsuspendUser)

module.exports = router 