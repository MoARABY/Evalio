const {createQuestion,getQuestions,getQuestionById,getQuestionsByExamId,updateQuestion,deleteQuestion} = require('../Controllers/questionController')    
const { createQuestionValidator,updateQuestionValidator,questionIdValidator} = require('../Validators/questionValidator')
const {verifyToken,allowedTo} = require('../Middlewares/verifyToken')

const router = require('express').Router()

router.route('/')
    .post(allowedTo('teacher'),createQuestionValidator,createQuestion)
    .get(verifyToken,getQuestions)
router.route('/:id')
    .get(verifyToken,questionIdValidator,getQuestionById)
    .put(allowedTo('teacher'),questionIdValidator,updateQuestionValidator,updateQuestion)
    .delete(allowedTo('admin','teacher'),questionIdValidator,deleteQuestion)
router.route('/exam/:examId')
    .get(verifyToken,getQuestionsByExamId)



/**
 * @swagger
 * components:
 *   schemas:
 *     Question:
 *       type: object
 *       required:
 *         - text
 *         - examId
 *         - type
 *       properties:
 *         text:
 *           type: string
 *           description: The question text
 *         examId:
 *           type: string
 *           description: ID of the exam this question belongs to
 *         type:
 *           type: string
 *           description: Type of the question (e.g., MCQ, Essay)
 *         options:
 *           type: array
 *           items:
 *             type: string
 *           description: List of options if the question is MCQ
 *         correctAnswer:
 *           type: string
 *           description: Correct answer (for MCQ)
 *       example:
 *         text: What is 2 + 2?
 *         examId: 6742a4c82f389b8395754abc
 *         type: MCQ
 *         options:
 *           - 3
 *           - 4
 *           - 5
 *         correctAnswer: 4
 */

/**
 * @swagger
 * tags:
 *   name: Questions
 *   description: Questions management routes
 */

/**
 * @swagger
 * /questions:
 *   get:
 *     summary: Get all questions
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of questions returned successfully
 *       403:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /questions:
 *   post:
 *     summary: Create a new question
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Question'
 *     responses:
 *       201:
 *         description: Question created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden (Teacher only)
 */

/**
 * @swagger
 * /questions/{id}:
 *   get:
 *     summary: Get a question by ID
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Question ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Question data returned successfully
 *       404:
 *         description: Question not found
 */

/**
 * @swagger
 * /questions/{id}:
 *   put:
 *     summary: Update a question
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Question ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Question'
 *     responses:
 *       200:
 *         description: Question updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Question not found
 *       403:
 *         description: Forbidden (Teacher only)
 */

/**
 * @swagger
 * /questions/{id}:
 *   delete:
 *     summary: Delete a question by ID
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Question ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Question deleted successfully
 *       404:
 *         description: Question not found
 *       403:
 *         description: Forbidden (Teacher/Admin only)
 */

/**
 * @swagger
 * /questions/exam/{examId}:
 *   get:
 *     summary: Get all questions for a specific exam
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         description: Exam ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Questions for the exam returned successfully
 *       404:
 *         description: No questions found for this exam
 */



module.exports = router