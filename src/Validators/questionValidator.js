const {check} = require('express-validator')
const questionModel = require('../../DB/Models/questionModel')
const examModel = require('../../DB/Models/examModel')
const validatorMiddleware = require('../Middlewares/validatorMiddleware')




createQuestionValidator = [
    check('text')
        .notEmpty().withMessage('Question text is required')
        .custom(async (value, { req }) => {
            const questionExists = await questionModel.findOne({text: value ,exam: req.body.exam});
            if (questionExists) throw new Error('Question text must be unique');
            return true
        }),
    check('questionType')
        .notEmpty().withMessage('Question type is required')
        .isIn(['multiple-choice', 'true-false', 'essay']).withMessage('Invalid question type'),
    check('options')
        .if(check('questionType').equals('multiple-choice'))
        .notEmpty().withMessage('Options are required for multiple-choice questions'),
    check('correctAnswer')
        .notEmpty().withMessage('Correct answer is required'),
    check('marks')
        .notEmpty().withMessage('Marks are required')
        .isNumeric().withMessage('Marks must be a number'),
    check('exam')
        .notEmpty().withMessage('Exam ID is required')
        .isMongoId().withMessage('Invalid Exam ID')
        .custom(async (value) => {
            const exam = await examModel.findById(value);
            if (!exam) throw new Error('Exam not found');
            return true;
        })
    ,validatorMiddleware
]

updateQuestionValidator = [
    check('text')
        .optional()
        .custom(async (value, { req }) => {
            const questionExists = await questionModel.findOne({text: value ,exam: req.body.exam});
            if (questionExists && questionExists._id.toString() !== req.params.id) throw new Error('Question text must be unique');
            return true
        }),
    check('questionType')
        .optional()
        .isIn(['multiple-choice', 'true-false', 'essay']).withMessage('Invalid question type'),
    check('options')
        .optional()
        .if(check('questionType').equals('multiple-choice'))
        .notEmpty().withMessage('Options are required for multiple-choice questions'),
    check('marks')
        .optional()
        .notEmpty().withMessage('Marks are required')
        .isNumeric().withMessage('Marks must be a number'),
    check('exam')
        .optional()
        .isMongoId().withMessage('Invalid Exam ID')
        .custom(async (value) => {
            const exam = await examModel.findById(value);
            if (!exam) throw new Error('Exam not found');
            return true;
        })
    ,validatorMiddleware
]
questionIdValidator = [
    check('id')
        .isMongoId().withMessage('Invalid Question ID')
        .custom(async (value) => {
            const question = await questionModel.findById(value);
            if (!question) throw new Error('Question not found');
            return true;
        })
    ,validatorMiddleware
]



module.exports = {
    createQuestionValidator,
    updateQuestionValidator,
    questionIdValidator
}