const {check} = require('express-validator')
const academicYearModel = require('../../DB/Models/academicYearModel')
const academicTermModel = require('../../DB/Models/academicTermModel')
const validatorMiddleware = require('../Middlewares/validatorMiddleware')




createAcademicTermValidator = [
    check('name')
        .notEmpty().withMessage('Academic Term name is required')
        .custom(async (value,{req}) => {
            const academicTermExists = await academicTermModel.findOne({name: value ,academicYear:req.body.academicYear});
            if (academicTermExists) throw new Error('Academic Term name must be unique within the same academic year')
            return true
        }),
    check('description')
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),
    check('startDate')
        .notEmpty().withMessage('Start date is required')
        .isISO8601().withMessage('Start date must be a valid date'),
    check('endDate')
        .notEmpty().withMessage('End date is required')
        .isISO8601().withMessage('End date must be a valid date'),
    check('academicYear')
        .notEmpty().withMessage('Academic year is required')
        .isMongoId().withMessage('Academic year must be a valid ID')
        .custom(async (value) => {
            const academicYearExists = await academicYearModel.findById(value);
            if (!academicYearExists) throw new Error('Academic year not found');
            return true
        })
    ,validatorMiddleware
]

updateAcademicTermValidator = [
    check('description')
        .optional()
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),
    check('startDate')
        .optional()
        .isISO8601().withMessage('Start date must be a valid date'),
    check('endDate')
        .optional()
        .isISO8601().withMessage('End date must be a valid date')
    ,validatorMiddleware
]

academicTermIdValidator = [
    check('id')
        .isMongoId().withMessage('Invalid Academic Term ID')
        .custom(async (value) => {
            const academicTerm = await academicTermModel.findById(value);
            if (!academicTerm) throw new Error('Academic Term not found');
            return true;
        })
    ,validatorMiddleware
]

setAcademicYearIdValue = (req,res,next) => {
    if(!req.body.academicYear) req.body.academicYear = req.params.academicYearId
    next()
}


module.exports = {
    createAcademicTermValidator,
    updateAcademicTermValidator,
    academicTermIdValidator,
    setAcademicYearIdValue
}