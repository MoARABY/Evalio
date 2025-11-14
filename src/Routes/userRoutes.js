const {createUser,getAllUsers,getUserById,updateUser,updateUserPassword,deleteUser} = require('../Controllers/userController')
const {createUserValidator,updateUserValidator,changePasswordValidator,UserIdValidator} = require('../Validators/userValidator')
const router = require('express').Router()


router.route('/').get(getAllUsers).post(createUserValidator, createUser)
router.route('/:id').get(UserIdValidator, getUserById).put(UserIdValidator, updateUserValidator, updateUser).delete(UserIdValidator, deleteUser)
router.route('/:id/password').put(UserIdValidator, changePasswordValidator, updateUserPassword)

module.exports = router 