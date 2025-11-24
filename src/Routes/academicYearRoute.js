const {createAcademicYear,getAcademicYears,getAcademicYearById,updateAcademicYearById,asscociateYearAdmin,deleteAcademicYearById} = require('../Controllers/academicYearController')
const {createAcademicYearValidator,updateAcademicYearValidator,academicYearIdValidator} = require('../Validators/academicYearValidator')    
const {verifyToken,allowedTo} = require('../Middlewares/verifyToken')
const router = require('express').Router()

const academicTermRoute = require('./academicTermRoute')



router.use('/:academicYearId/academic-terms', academicTermRoute)

router.route('/')
    .post(allowedTo('admin'),createAcademicYearValidator, createAcademicYear)
    .get(verifyToken, getAcademicYears)

router.route('/:id')
    .get(verifyToken, academicYearIdValidator, getAcademicYearById)
    .put(allowedTo('admin'), academicYearIdValidator, updateAcademicYearValidator, updateAcademicYearById)
    .delete(allowedTo('admin'), academicYearIdValidator, deleteAcademicYearById)

router.route('/:id/associate')
    .put(allowedTo('admin'),academicYearIdValidator,updateAcademicYearValidator, asscociateYearAdmin)


/**
 * @swagger
 * components:
 *   schemas:
 *     AcademicYear:
 *       type: object
 *       required:
 *         - name
 *         - startDate
 *         - endDate
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the academic year (e.g., 2024/2025)
 *         startDate:
 *           type: string
 *           format: date
 *           description: Start date of the academic year
 *         endDate:
 *           type: string
 *           format: date
 *           description: End date of the academic year
 *       example:
 *         name: 2024/2025
 *         startDate: 2024-09-01
 *         endDate: 2025-06-30
 */

/**
 * @swagger
 * tags:
 *   name: Academic Years
 *   description: Academic years management routes
 */

/**
 * @swagger
 * /academic-years:
 *   get:
 *     summary: Get all academic years
 *     tags: [Academic Years]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of academic years
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AcademicYear'
 *       403:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /academic-years:
 *   post:
 *     summary: Create a new academic year
 *     tags: [Academic Years]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AcademicYear'
 *     responses:
 *       201:
 *         description: Academic year created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden (Admin only)
 */

/**
 * @swagger
 * /academic-years/{id}:
 *   get:
 *     summary: Get academic year by ID
 *     tags: [Academic Years]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Academic year ID
 *     responses:
 *       200:
 *         description: Academic year data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AcademicYear'
 *       404:
 *         description: Academic year not found
 */

/**
 * @swagger
 * /academic-years/{id}:
 *   put:
 *     summary: Update academic year by ID
 *     tags: [Academic Years]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Academic year ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AcademicYear'
 *     responses:
 *       200:
 *         description: Academic year updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Academic year not found
 *       403:
 *         description: Forbidden (Admin only)
 */

/**
 * @swagger
 * /academic-years/{id}:
 *   delete:
 *     summary: Delete academic year by ID
 *     tags: [Academic Years]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Academic year ID
 *     responses:
 *       200:
 *         description: Academic year deleted successfully
 *       404:
 *         description: Academic year not found
 *       403:
 *         description: Forbidden (Admin only)
 */

/**
 * @swagger
 * /academic-years/{id}/associate:
 *   put:
 *     summary: Associate an academic year with an admin or update relationship
 *     tags: [Academic Years]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Academic year ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               adminId:
 *                 type: string
 *                 description: The admin user ID to associate with the academic year
 *             example:
 *               adminId: 673a3d9971bc41bc885c81ab
 *     responses:
 *       200:
 *         description: Academic year association updated successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: Academic year not found
 */

/**
 * @swagger
 * /academic-years/{academicYearId}/academic-terms:
 *   get:
 *     summary: Get all academic terms for a specific academic year
 *     tags: [Academic Years]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: academicYearId
 *         required: true
 *         schema:
 *           type: string
 *         description: Academic year ID
 *     responses:
 *       200:
 *         description: List of academic terms for this academic year
 *       404:
 *         description: Academic year not found
 */


module.exports = router