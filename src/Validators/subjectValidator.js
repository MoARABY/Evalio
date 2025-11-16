const {check} = require('express-validator')
const subjectModel = require('../../DB/Models/subjectModel')
const academicTermModel = require('../../DB/Models/academicTermModel')
const validatorMiddleware = require('../Middlewares/validatorMiddleware')




createSubjectValidator = [
    check('name')
        .notEmpty().withMessage('subject name is required')
        .custom(async (value,{req}) => {
            const subjectExists = await subjectModel.findOne({name: value ,academicTerm:req.body.academicTerm});
            if (subjectExists) throw new Error('Subject name must be unique within the same academic Term')
            return true
        }),
    check('code')
        .notEmpty().withMessage('Subject code is required')
        .custom(async (value,{req}) => {
            const codeExists = await subjectModel.findOne({code: value ,academicTerm:req.body.academicTerm});
            if (codeExists) throw new Error('Subject code must be unique within the same academic Term')
            return true
        }),
    check('description')
        .notEmpty().withMessage('Description is required'),
    check('academicTerm')
        .notEmpty().withMessage('Academic Term is required')
        .isMongoId().withMessage('Academic Term must be a valid ID')
        .custom(async (value) => {
            const academicTermExists = await academicTermModel.findById(value);
            if (!academicTermExists) throw new Error('Academic Term not found');
            return true
        })
    ,validatorMiddleware
]

updateSubjectValidator = [
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
            const codeExists = await subjectModel.findOne({code: value ,academicTerm:req.body.academicTerm});
            if (codeExists) throw new Error('Subject code must be unique within the same academic Term')
            return true
        })
    ,validatorMiddleware
]

subjectIdValidator = [
    check('id')
        .isMongoId().withMessage('Invalid subject ID')
        .custom(async (value) => {
            const subject = await subjectModel.findById(value);
            if (!subject) throw new Error('Subject not found');
            return true;
        })
    ,validatorMiddleware
]

setAcademicTermIdInBody = (req, res, next) => {
    if (!req.body.academicTerm) req.body.academicTerm = req.params.academicTermId;
    next();
}

module.exports = {
    createSubjectValidator,
    updateSubjectValidator,
    subjectIdValidator,
    setAcademicTermIdInBody
}