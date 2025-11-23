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

module.exports = router