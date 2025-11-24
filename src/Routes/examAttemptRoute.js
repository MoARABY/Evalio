const {startAttemptExam,submitAnswer,submitExam} = require('../Controllers/examAttemptController')
const {verifyToken,allowedTo} = require('../Middlewares/verifyToken')
const limiter=require('../Middlewares/rateLimiter')

const router = require('express').Router()

router.route('/:examId/start')
    .get(limiter, allowedTo('teacher','student'),startAttemptExam)
router.route('/:questionId/submit-answer')
    .post(allowedTo('teacher','student'),submitAnswer)
router.route('/submit-exam')
    .post(allowedTo('teacher','student'),submitExam)



/**
 * @swagger
 * components:
 *   schemas:
 *     SubmitAnswer:
 *       type: object
 *       required:
 *         - questionId
 *         - answer
 *       properties:
 *         questionId:
 *           type: string
 *           description: ID of the question being answered
 *         answer:
 *           type: string
 *           description: Student's submitted answer
 *       example:
 *         questionId: 6742a4c82f389b8395754abc
 *         answer: "C"
 */

/**
 * @swagger
 * tags:
 *   name: Exams Attempt
 *   description: Exam operations (start attempt, submit answer, submit exam)
 */

/**
 * @swagger
 * /exams/{examId}/start:
 *   get:
 *     summary: Start an exam attempt
 *     tags: [Exams Attempt]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         description: Exam ID to start attempt
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exam attempt started successfully
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Exam not found
 */

/**
 * @swagger
 * /exams/{questionId}/submit-answer:
 *   post:
 *     summary: Submit an answer to a specific question
 *     tags: [Exams Attempt]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         description: Question ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubmitAnswer'
 *     responses:
 *       200:
 *         description: Answer submitted successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Question not found
 */

/**
 * @swagger
 * /exams/submit-exam:
 *   post:
 *     summary: Submit the entire exam attempt
 *     tags: [Exams Attempt]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - submissionId
 *             properties:
 *               submissionId:
 *                 type: string
 *                 description: ID of the exam attempt being submitted
 *             example:
 *               submissionId: 6742b2c12f389b8395754cde
 *     responses:
 *       200:
 *         description: Exam submitted successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Submission not found
 */

module.exports = router