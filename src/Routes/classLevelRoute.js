const {createClassLevel,getClassLevels,getClassLevelById,updateClassLevel,addSubjectsToClassLevel,addTeachersToClassLevel,deleteClassLevel} = require('../Controllers/classLevelController')
const {createClassValidator,updateClassValidator,ClassIdValidator} = require('../Validators/classLevelValidator')
const {verifyToken,allowedTo} = require('../Middlewares/verifyToken')

const router = require('express').Router()

router.route('/')
    .post(allowedTo('admin'),createClassValidator,createClassLevel)
    .get(verifyToken,getClassLevels)
router.route('/:id')
    .get(verifyToken,ClassIdValidator,getClassLevelById)
    .put(allowedTo('admin'),ClassIdValidator,updateClassValidator,updateClassLevel)
    .delete(allowedTo('admin'),ClassIdValidator,deleteClassLevel)

router.route('/:id/subjects')
    .put(allowedTo('admin'),ClassIdValidator,updateClassValidator,addSubjectsToClassLevel)
    
router.route('/:id/teachers')
    .put(allowedTo('admin'),ClassIdValidator,updateClassValidator,addTeachersToClassLevel)


/**
 * @swagger
 * components:
 *   schemas:
 *     ClassLevel:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         name:
 *           type: string
 *           description: Class level name (e.g., Grade 1, Grade 2)
 *         description:
 *           type: string
 *           description: Short description of the class level
 *         subjects:
 *           type: array
 *           items:
 *             type: string
 *           description: List of subject IDs assigned to this class level
 *         teachers:
 *           type: array
 *           items:
 *             type: string
 *           description: List of teacher IDs assigned to this class level
 *       example:
 *         name: Grade 1
 *         description: First level of primary school
 *         subjects:
 *           - 673a44f42f389b8395754abb
 *         teachers:
 *           - 673a45d12f389b8395754bc2
 */

/**
 * @swagger
 * tags:
 *   name: Class Levels
 *   description: Class levels management routes
 */

/**
 * @swagger
 * /class-levels:
 *   get:
 *     summary: Get all class levels
 *     tags: [Class Levels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of class levels
 *       403:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /class-levels:
 *   post:
 *     summary: Create a new class level
 *     tags: [Class Levels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClassLevel'
 *     responses:
 *       201:
 *         description: Class level created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden (Admin only)
 */

/**
 * @swagger
 * /class-levels/{id}:
 *   get:
 *     summary: Get a class level by ID
 *     tags: [Class Levels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Class level ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Class level data
 *       404:
 *         description: Class level not found
 */

/**
 * @swagger
 * /class-levels/{id}:
 *   put:
 *     summary: Update class level information
 *     tags: [Class Levels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Class level ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClassLevel'
 *     responses:
 *       200:
 *         description: Class level updated successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: Class level not found
 */

/**
 * @swagger
 * /class-levels/{id}:
 *   delete:
 *     summary: Delete a class level by ID
 *     tags: [Class Levels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Class level ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Class level deleted successfully
 *       404:
 *         description: Class level not found
 *       403:
 *         description: Forbidden (Admin only)
 */

/**
 * @swagger
 * /class-levels/{id}/subjects:
 *   put:
 *     summary: Add subjects to a class level
 *     tags: [Class Levels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Class level ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subjects:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of subject IDs to assign
 *             example:
 *               subjects:
 *                 - 673a44bc2f389b8395754aa2
 *                 - 673a44bc2f389b8395754aa3
 *     responses:
 *       200:
 *         description: Subjects added to class level successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Class level not found
 *       403:
 *         description: Forbidden (Admin only)
 */

/**
 * @swagger
 * /class-levels/{id}/teachers:
 *   put:
 *     summary: Add teachers to a class level
 *     tags: [Class Levels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Class level ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teachers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of teacher IDs to assign
 *             example:
 *               teachers:
 *                 - 673a45d12f389b8395754bc2
 *                 - 673a45d12f389b8395754bc7
 *     responses:
 *       200:
 *         description: Teachers added to class level successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Class level not found
 *       403:
 *         description: Forbidden (Admin only)
 */


module.exports = router