const {signup,login,logout,loggedUserProfile,updateLoggedUser,changeLoggedUserPassword,forgotPassword,verifyResetCode,resetPassword}=require('../Controllers/authController')
const {verifyToken}=require('../Middlewares/verifyToken')
const {createUserValidator,updateUserValidator,changeLoggedUserPasswordValidator}=require('../Validators/userValidator')
const limiter=require('../Middlewares/rateLimiter')
const router = require('express').Router()

router.post('/signup',limiter,createUserValidator,signup);
router.post('/login',limiter,login);
router.post('/logout',verifyToken,logout);
router.get('/profile',verifyToken,loggedUserProfile);
router.put('/',verifyToken,updateUserValidator,updateLoggedUser);
router.put('/changePassword',verifyToken,changeLoggedUserPasswordValidator,changeLoggedUserPassword);
router.post('/forgotPassword',limiter,forgotPassword);
router.post('/verifyCode',verifyResetCode);
router.post('/resetPassword',resetPassword);

/**
 * @swagger
 * components:
 *   schemas:
 *     UserAuth:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: Full name of the user
 *         email:
 *           type: string
 *           description: User email address
 *         password:
 *           type: string
 *           description: User password
 *       example:
 *         name: Mohamed Ahmed
 *         email: mo@example.com
 *         password: Pass12345

 *     ChangePassword:
 *       type: object
 *       required:
 *         - currentPassword
 *         - newPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *         newPassword:
 *           type: string
 *       example:
 *         currentPassword: Pass12345
 *         newPassword: NewPass6789
 *
 *     ResetPassword:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *       example:
 *         email: mo@example.com
 *         password: NewPass1234
 *
 *     VerifyCode:
 *       type: object
 *       required:
 *         - resetCode
 *       properties:
 *         resetCode:
 *           type: string
 *       example:
 *         resetCode: "849201"
 */

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and profile management
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserAuth'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user and return access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: mo@example.com
 *               password: Pass12345
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout logged-in user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       403:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get logged user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile returned
 *       403:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /auth:
 *   put:
 *     summary: Update logged-in user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *             example:
 *               name: Mohamed Updated
 *               email: newmo@example.com
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /auth/changePassword:
 *   put:
 *     summary: Change logged-in user's password
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePassword'
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Incorrect current password
 */

/**
 * @swagger
 * /auth/forgotPassword:
 *   post:
 *     summary: Send password reset verification code to email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *             example:
 *               email: mo@example.com
 *     responses:
 *       200:
 *         description: Reset code sent successfully
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /auth/verifyCode:
 *   post:
 *     summary: Verify password reset code
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyCode'
 *     responses:
 *       200:
 *         description: Code verified successfully
 *       400:
 *         description: Invalid or expired code
 */

/**
 * @swagger
 * /auth/resetPassword:
 *   post:
 *     summary: Reset user password after code verification
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPassword'
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Validation error
 */


module.exports = router;