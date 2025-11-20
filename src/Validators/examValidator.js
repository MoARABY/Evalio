const {check} = require('express-validator')
const examModel = require('../../DB/Models/examModel')
const subjectModel = require('../../DB/Models/subjectModel')
const classLevelModel = require('../../DB/Models/classLevelModel')
const academicYearModel = require('../../DB/Models/academicYearModel')
const validatorMiddleware = require('../Middlewares/validatorMiddleware')




createExamValidator = [
    check('title')
        .notEmpty().withMessage('Exam title is required')
        .isString().withMessage('Exam title must be a string')
        .custom(async (value, { req }) => {
            const exam = await examModel.findOne({title: value, academicYear: req.body.academicYear})
            if (exam) {
                throw new Error('Exam title already exists')
            }
            return true
        }),
    check('description')
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),
    check('subject')
        .notEmpty().withMessage('Subject is required')
        .isMongoId().withMessage('Subject must be a valid ID')
        .custom(async (value) => {
            const subjectExists = await subjectModel.findById(value);
            if (!subjectExists) throw new Error('Subject not found');
            return true
        }),
    check('classLevel')
        .notEmpty().withMessage('Class Level is required')
        .isMongoId().withMessage('Class Level must be a valid ID')
        .custom(async (value) => {
            const classLevelExists = await classLevelModel.findById(value)
            if (!classLevelExists) throw new Error('Class Level not found')
            return true
        }),
    check('academicYear')
        .notEmpty().withMessage('Academic Year is required')
        .isMongoId().withMessage('Academic Year must be a valid ID')
        .custom(async (value) => {
            const academicYearExists = await academicYearModel.findById(value)
            if (!academicYearExists) throw new Error('Academic Year not found')
            return true
        }),
    check('examDate')
        .notEmpty().withMessage('Exam Date is required')
        .isISO8601().withMessage('Exam Date must be a valid date'),
    check('duration')
        .notEmpty().withMessage('Duration is required'),
    check('totalMarks')
        .notEmpty().withMessage('Total Marks is required')
        .isNumeric().withMessage('Total Marks must be a number'),
    check('passMarks')
        .notEmpty().withMessage('Pass Marks is required')
        .isNumeric().withMessage('Pass Marks must be a number')
    ,validatorMiddleware
]

updateExamValidator = [
    check('academicTerm')
        .optional()
        .isMongoId().withMessage('Academic Term must be a valid ID')
        .custom(async (value) => {
            const academicTermExists = await academicTermModel.findById(value);
            if (!academicTermExists) throw new Error('Academic Term not found');
            return true
        }),
    check('code')
        .optional()
        .custom(async (value,{req}) => {
            const codeExists = await ExamModel.findOne({code: value ,academicTerm:req.body.academicTerm});
            if (codeExists) throw new Error('Exam code must be unique within the same academic Term')
            return true
        })
    ,validatorMiddleware
]

examIdValidator = [
    check('id')
        .isMongoId().withMessage('Invalid Exam ID')
        .custom(async (value) => {
            const Exam = await examModel.findById(value);
            if (!Exam) throw new Error('Exam not found');
            return true;
        })
    ,validatorMiddleware
]

module.exports = {
    createExamValidator,
    updateExamValidator,
    examIdValidator
}