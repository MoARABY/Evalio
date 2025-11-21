const {startAttemptExam,submitAnswer,submitExam} = require('../Controllers/examAttemptController')
const {verifyToken,allowedTo} = require('../Middlewares/verifyToken')

const router = require('express').Router()

router.route('/:examId/start')
    .get(allowedTo('teacher','student'),startAttemptExam)
router.route('/:questionId/submit-answer')
    .post(allowedTo('teacher','student'),submitAnswer)
router.route('/submit-exam')
    .post(allowedTo('teacher','student'),submitExam)

module.exports = router