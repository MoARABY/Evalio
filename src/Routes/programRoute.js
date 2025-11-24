const {createProgram,getPrograms,getProgramById,updateProgram,deleteProgram} = require('../Controllers/programController')
const { createProgramValidator,updateProgramValidator,programIdValidator} = require('../Validators/programValidator')
const {verifyToken,allowedTo} = require('../Middlewares/verifyToken')
const cacheMiddleware = require('../Middlewares/cacheMiddleware')

const router = require('express').Router()

router.route('/')
    .post(allowedTo('admin'),createProgramValidator,createProgram)
    .get(verifyToken,cacheMiddleware('programs'),getPrograms)
router.route('/:id')
    .get(verifyToken,programIdValidator,cacheMiddleware('program','id'),getProgramById)
    .put(allowedTo('admin'),programIdValidator,updateProgramValidator,updateProgram)
    .delete(allowedTo('admin'),programIdValidator,deleteProgram)

/**
 * @swagger
 * components:
 *   schemas:
 *     Program:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         name:
 *           type: string
 *           description: Program name
 *         description:
 *           type: string
 *           description: Program description
 *         isActive:
 *           type: boolean
 *           description: Whether the program is active
 *       example:
 *         name: Computer Science Program
 *         description: A 4-year program focusing on software engineering and AI.
 *         isActive: true
 */

/**
 * @swagger
 * tags:
 *   name: Programs
 *   description: Programs management routes
 */

/**
 * @swagger
 * /programs:
 *   get:
 *     summary: Get all programs
 *     tags: [Programs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of programs returned successfully
 *       403:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /programs:
 *   post:
 *     summary: Create a new program
 *     tags: [Programs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Program'
 *     responses:
 *       201:
 *         description: Program created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden (Admin only)
 */

/**
 * @swagger
 * /programs/{id}:
 *   get:
 *     summary: Get a program by ID
 *     tags: [Programs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Program ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Program data returned successfully
 *       404:
 *         description: Program not found
 *       403:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /programs/{id}:
 *   put:
 *     summary: Update a program
 *     tags: [Programs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Program ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Program'
 *     responses:
 *       200:
 *         description: Program updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Program not found
 *       403:
 *         description: Forbidden (Admin only)
 */

/**
 * @swagger
 * /programs/{id}:
 *   delete:
 *     summary: Delete a program
 *     tags: [Programs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Program ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Program deleted successfully
 *       404:
 *         description: Program not found
 *       403:
 *         description: Forbidden (Admin only)
 */



module.exports = router