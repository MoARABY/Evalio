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



module.exports = router