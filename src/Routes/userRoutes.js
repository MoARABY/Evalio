const {createUser,getAllUsers,getUserById,updateUser,deleteUser} = require('../Controllers/userController')
const router = require('express').Router()


router.route('/').get(getAllUsers).post(createUser)
router.route('/:id').get(getUserById).put(updateUser).delete(deleteUser)

module.exports = router 