const {createExam,getExams,getExamById,getExamBySubjectId,updateExam,deleteExam,publishExam,unpublishExam} = require('../Controllers/examController')
const { createExamValidator,updateExamValidator,examIdValidator} = require('../Validators/examValidator')
const {verifyToken,allowedTo} = require('../Middlewares/verifyToken')

const router = require('express').Router()

router.route('/')
    .post(allowedTo('teacher'),createExamValidator,createExam)
    .get(allowedTo('teacher','admin'),getExams)
router.route('/:id')
    .get(allowedTo('teacher','admin'),examIdValidator,getExamById)
    .put(allowedTo('teacher'),examIdValidator,updateExamValidator,updateExam)
    .delete(allowedTo('admin','teacher'),examIdValidator,deleteExam)
router.route('/subject/:subjectId')
    .get(verifyToken,getExamBySubjectId)
router.route('/:id/publish')
    .put(allowedTo('teacher'),examIdValidator,publishExam)
router.route('/:id/unpublish')
    .put(allowedTo('teacher'),examIdValidator,unpublishExam)


/**
 * @swagger
 * components:
 *   schemas:
 *     Exam:
 *       type: object
 *       required:
 *         - title
 *         - subject
 *         - duration
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the exam
 *         subject:
 *           type: string
 *           description: Subject ID related to this exam
 *         duration:
 *           type: number
 *           description: Duration of the exam in minutes
 *         isPublished:
 *           type: boolean
 *           description: Indicates whether the exam is published
 *       example:
 *         title: Math Exam - Unit 3
 *         subject: 673a44f42f389b8395754abb
 *         duration: 45
 *         isPublished: false
 */

/**
 * @swagger
 * tags:
 *   name: Exams
 *   description: Exams management routes
 */

/**
 * @swagger
 * /exams:
 *   get:
 *     summary: Get all exams
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of exams returned successfully
 *       403:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /exams:
 *   post:
 *     summary: Create a new exam
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Exam'
 *     responses:
 *       201:
 *         description: Exam created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden (Only teachers allowed)
 */

/**
 * @swagger
 * /exams/{id}:
 *   get:
 *     summary: Get an exam by ID
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Exam ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exam data returned successfully
 *       404:
 *         description: Exam not found
 */

/**
 * @swagger
 * /exams/{id}:
 *   put:
 *     summary: Update an exam
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Exam ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Exam'
 *     responses:
 *       200:
 *         description: Exam updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Exam not found
 *       403:
 *         description: Forbidden (Only teachers allowed)
 */

/**
 * @swagger
 * /exams/{id}:
 *   delete:
 *     summary: Delete an exam by ID
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Exam ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exam deleted successfully
 *       404:
 *         description: Exam not found
 *       403:
 *         description: Forbidden (Teachers/Admin only)
 */

/**
 * @swagger
 * /exams/subject/{subjectId}:
 *   get:
 *     summary: Get exams by subject ID
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subjectId
 *         required: true
 *         description: Subject ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exams filtered by subject returned successfully
 *       404:
 *         description: No exams found for this subject
 */

/**
 * @swagger
 * /exams/{id}/publish:
 *   put:
 *     summary: Publish an exam
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Exam ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exam published successfully
 *       404:
 *         description: Exam not found
 *       403:
 *         description: Forbidden (Only teachers)
 */

/**
 * @swagger
 * /exams/{id}/unpublish:
 *   put:
 *     summary: Unpublish an exam
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Exam ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exam unpublished successfully
 *       404:
 *         description: Exam not found
 *       403:
 *         description: Forbidden (Only teachers)
 */



module.exports = router