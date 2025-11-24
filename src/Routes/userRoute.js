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


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - role
 *       properties:
 *         name:
 *           type: string
 *           description: Full name of the user
 *         email:
 *           type: string
 *           description: Email of the user
 *         password:
 *           type: string
 *           description: Password for the user (hashed in DB)
 *         role:
 *           type: string
 *           description: Role of the user (admin, teacher, student)
 *         isSuspended:
 *           type: boolean
 *           description: Whether the user account is suspended
 *       example:
 *         name: John Doe
 *         email: johndoe@example.com
 *         password: "StrongPassword123"
 *         role: teacher
 *         isSuspended: false
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users management routes
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users returned successfully
 *       403:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden (Admin only)
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User data returned successfully
 *       404:
 *         description: User not found
 *       403:
 *         description: Forbidden (Admin only)
 */

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 *       403:
 *         description: Forbidden (Admin only)
 */

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Withdraw (delete) a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User withdrawn successfully
 *       404:
 *         description: User not found
 *       403:
 *         description: Forbidden (Admin only)
 */

/**
 * @swagger
 * /users/{id}/password:
 *   put:
 *     summary: Change a user's password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 description: New password for the user
 *             example:
 *               password: NewStrongPassword123
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 *       403:
 *         description: Forbidden (Admin only)
 */

/**
 * @swagger
 * /users/{id}/suspend:
 *   put:
 *     summary: Suspend a user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User suspended successfully
 *       404:
 *         description: User not found
 *       403:
 *         description: Forbidden (Admin only)
 */

/**
 * @swagger
 * /users/{id}/unsuspend:
 *   put:
 *     summary: Unsuspend a user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User unsuspended successfully
 *       404:
 *         description: User not found
 *       403:
 *         description: Forbidden (Admin only)
 */


module.exports = router 