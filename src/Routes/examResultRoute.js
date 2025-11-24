const {getExamsResults,getExamResultById,updateExamResult,deleteExamResult,publishExamResult,unpublishExamResult,getExamResultByStudentId} = require('../Controllers/examResultController')  
const { createExamValidator,updateExamValidator,examIdValidator} = require('../Validators/examValidator')
const {verifyToken,allowedTo} = require('../Middlewares/verifyToken')

const router = require('express').Router()

router.route('/')
    .get(verifyToken,getExamsResults)
router.route('/:id')
    .get(verifyToken,examIdValidator,getExamResultById)
    .put(allowedTo('teacher'),examIdValidator,updateExamValidator,updateExamResult)
    .delete(allowedTo('admin','teacher'),examIdValidator,deleteExamResult)
router.route('/:id/publish')
    .put(allowedTo('teacher'),examIdValidator,publishExamResult)
router.route('/:id/unpublish')
    .put(allowedTo('teacher'),examIdValidator,unpublishExamResult)
router.route('/:studentId')
    .get(verifyToken,getExamResultByStudentId)


/**
 * @swagger
 * components:
 *   schemas:
 *     ExamResult:
 *       type: object
 *       required:
 *         - examId
 *         - studentId
 *         - score
 *       properties:
 *         examId:
 *           type: string
 *           description: ID of the exam
 *         studentId:
 *           type: string
 *           description: ID of the student
 *         score:
 *           type: number
 *           description: Score obtained by the student
 *         isPublished:
 *           type: boolean
 *           description: Whether the result is published
 *       example:
 *         examId: 6742a4c82f389b8395754abc
 *         studentId: 6742b5d12f389b8395754def
 *         score: 85
 *         isPublished: false
 */

/**
 * @swagger
 * tags:
 *   name: Exam Results
 *   description: Routes for managing exam results
 */

/**
 * @swagger
 * /exam-results:
 *   get:
 *     summary: Get all exam results
 *     tags: [Exam Results]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of exam results returned successfully
 *       403:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /exam-results/{id}:
 *   get:
 *     summary: Get an exam result by ID
 *     tags: [Exam Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Exam result ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exam result data returned successfully
 *       404:
 *         description: Exam result not found
 */

/**
 * @swagger
 * /exam-results/{id}:
 *   put:
 *     summary: Update an exam result
 *     tags: [Exam Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Exam result ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExamResult'
 *     responses:
 *       200:
 *         description: Exam result updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Exam result not found
 *       403:
 *         description: Forbidden (Teacher only)
 */

/**
 * @swagger
 * /exam-results/{id}:
 *   delete:
 *     summary: Delete an exam result by ID
 *     tags: [Exam Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Exam result ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exam result deleted successfully
 *       404:
 *         description: Exam result not found
 *       403:
 *         description: Forbidden (Teacher/Admin only)
 */

/**
 * @swagger
 * /exam-results/{id}/publish:
 *   put:
 *     summary: Publish an exam result
 *     tags: [Exam Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Exam result ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exam result published successfully
 *       404:
 *         description: Exam result not found
 *       403:
 *         description: Forbidden (Teacher only)
 */

/**
 * @swagger
 * /exam-results/{id}/unpublish:
 *   put:
 *     summary: Unpublish an exam result
 *     tags: [Exam Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Exam result ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exam result unpublished successfully
 *       404:
 *         description: Exam result not found
 *       403:
 *         description: Forbidden (Teacher only)
 */

/**
 * @swagger
 * /exam-results/student/{studentId}:
 *   get:
 *     summary: Get exam results by student ID
 *     tags: [Exam Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: Student ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exam results for the student returned successfully
 *       404:
 *         description: No exam results found for this student
 */


module.exports = router