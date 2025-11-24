const {createAcademicTerm,getAcademicTerms,getAcademicTermById,updateAcademicTermById,deleteAcademicTermById} = require('../Controllers/academicTermController');
const {createAcademicTermValidator,updateAcademicTermValidator,setAcademicYearIdValue,academicTermIdValidator} = require('../Validators/academicTermValidator');
const {verifyToken,allowedTo} = require('../Middlewares/verifyToken')
const subjectRoute = require('./subjectRoute');


const router = require('express').Router({mergeParams:true})


/**
 * @swagger
 * components:
 *   schemas:
 *     AcademicTerm:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - academicYear
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the academic term (e.g., Fall, Spring)
 *         description:
 *           type: string
 *           description: Short description of the term
 *         academicYear:
 *           type: string
 *           description: The academic year ID associated with the term
 *       example:
 *         name: Fall Term
 *         description: The first term of the academic year
 *         academicYear: 673a31f76b33fa8a51617091
 */

/**
 * @swagger
 * tags:
 *   name: Academic Terms
 *   description: Academic terms management routes
 */

/**
 * @swagger
 * /academic-terms:
 *   get:
 *     summary: Get all academic terms
 *     tags: [Academic Terms]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of academic terms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AcademicTerm'
 *       403:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /academic-terms:
 *   post:
 *     summary: Create a new academic term
 *     tags: [Academic Terms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AcademicTerm'
 *     responses:
 *       201:
 *         description: Academic term created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden (Admin only)
 */

/**
 * @swagger
 * /academic-terms/{id}:
 *   get:
 *     summary: Get a specific academic term by ID
 *     tags: [Academic Terms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Academic term ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Academic term data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AcademicTerm'
 *       404:
 *         description: Academic term not found
 */

/**
 * @swagger
 * /academic-terms/{id}:
 *   put:
 *     summary: Update an academic term by ID
 *     tags: [Academic Terms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Academic term ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AcademicTerm'
 *     responses:
 *       200:
 *         description: Academic term updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Academic term not found
 *       403:
 *         description: Forbidden (Admin only)
 */

/**
 * @swagger
 * /academic-terms/{id}:
 *   delete:
 *     summary: Delete an academic term by ID
 *     tags: [Academic Terms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Academic term ID
 *     responses:
 *       200:
 *         description: Academic term deleted successfully
 *       404:
 *         description: Academic term not found
 *       403:
 *         description: Forbidden (Admin only)
 */

/**
 * @swagger
 * /academic-terms/{academicTermId}/subjects:
 *   get:
 *     summary: Get subjects for a specific academic term
 *     tags: [Academic Terms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: academicTermId
 *         required: true
 *         description: Academic term ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of subjects belonging to the academic term
 *       404:
 *         description: Academic term not found
 */



router.use('/:academicTermId/subjects', subjectRoute);
router.route('/')
    .post(allowedTo('admin'),setAcademicYearIdValue,createAcademicTermValidator, createAcademicTerm)
    .get(verifyToken, getAcademicTerms)
router.route('/:id')
    .get(verifyToken, academicTermIdValidator, getAcademicTermById)
    .put(allowedTo('admin'), academicTermIdValidator, updateAcademicTermValidator, updateAcademicTermById)
    .delete(allowedTo('admin'), academicTermIdValidator, deleteAcademicTermById)


module.exports = router