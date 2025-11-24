const {createSubject,getSubjects,getSubjectById,updateSubjectById,deleteSubject} = require('../Controllers/subjectController')
const {createSubjectValidator, updateSubjectValidator, subjectIdValidator,setAcademicTermIdInBody} = require('../Validators/subjectValidator')
const {verifyToken,allowedTo} = require('../Middlewares/verifyToken')
const cacheMiddleware = require('../Middlewares/cacheMiddleware')


const router = require('express').Router({mergeParams:true})


router.route('/')
    .post(allowedTo('admin'),setAcademicTermIdInBody,createSubjectValidator,createSubject)
    .get(verifyToken,cacheMiddleware('subjects'),getSubjects)

router.route('/:id')
    .get(verifyToken,subjectIdValidator,cacheMiddleware('subject','id'),getSubjectById)
    .put(allowedTo('admin'),subjectIdValidator,updateSubjectValidator,updateSubjectById)
    .delete(allowedTo('admin'),subjectIdValidator,deleteSubject)



/**
 * @swagger
 * components:
 *   schemas:
 *     Subject:
 *       type: object
 *       required:
 *         - name
 *         - academicTermId
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the subject
 *         academicTermId:
 *           type: string
 *           description: ID of the academic term this subject belongs to
 *         description:
 *           type: string
 *           description: Optional description of the subject
 *         isActive:
 *           type: boolean
 *           description: Whether the subject is active
 *       example:
 *         name: Mathematics
 *         academicTermId: 6742a4c82f389b8395754def
 *         description: Math subject for Grade 1
 *         isActive: true
 */

/**
 * @swagger
 * tags:
 *   name: Subjects
 *   description: Subjects management routes
 */

/**
 * @swagger
 * /subjects:
 *   get:
 *     summary: Get all subjects
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of subjects returned successfully
 *       403:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /subjects:
 *   post:
 *     summary: Create a new subject
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subject'
 *     responses:
 *       201:
 *         description: Subject created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden (Admin only)
 */

/**
 * @swagger
 * /subjects/{id}:
 *   get:
 *     summary: Get a subject by ID
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Subject ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subject data returned successfully
 *       404:
 *         description: Subject not found
 *       403:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /subjects/{id}:
 *   put:
 *     summary: Update a subject
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Subject ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subject'
 *     responses:
 *       200:
 *         description: Subject updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Subject not found
 *       403:
 *         description: Forbidden (Admin only)
 */

/**
 * @swagger
 * /subjects/{id}:
 *   delete:
 *     summary: Delete a subject by ID
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Subject ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subject deleted successfully
 *       404:
 *         description: Subject not found
 *       403:
 *         description: Forbidden (Admin only)
 */


module.exports = router