const {createUser,getAllUsers,getUserById,updateUser,updateUserPassword,withdrawUser,suspendUser,unsuspendUser} = require('../Controllers/userController')
const {createUserValidator,updateUserValidator,changePasswordValidator,UserIdValidator} = require('../Validators/userValidator')
const {allowedTo} = require('../Middlewares/verifyToken')
const cacheMiddleware = require('../Middlewares/cacheMiddleware')
const router = require('express').Router()

// no verify token in get all users controller to check if token logic work
router.route('/').get(cacheMiddleware('users'), getAllUsers).post(allowedTo('admin'), createUserValidator, createUser)
router.route('/:id').get(allowedTo('admin'), UserIdValidator,getUserById).put(allowedTo('admin'), UserIdValidator, updateUserValidator, updateUser).delete(allowedTo('admin'), UserIdValidator, withdrawUser)
router.route('/:id/password').put(allowedTo('admin'), UserIdValidator, changePasswordValidator, updateUserPassword)
router.route('/:id/suspend').put(allowedTo('admin'), UserIdValidator, suspendUser)
router.route('/:id/unsuspend').put(allowedTo('admin'), UserIdValidator, unsuspendUser)
module.exports = router 