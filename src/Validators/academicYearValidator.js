const {check} = require('express-validator')
const academicYearModel = require('../../DB/Models/academicYearModel')
const userModel = require('../../DB/Models/userModel')
const validatorMiddleware = require('../Middlewares/validatorMiddleware')
const { updateAcademicYearById } = require('../Controllers/academicYearController')




createAcademicYearValidator = [
    check('name')
        .notEmpty().withMessage('Academic year name is required')
        .custom(async (value) => {
            const academicYearExists = await academicYearModel.findOne({name: value });
            if (academicYearExists) throw new Error('Academic year name must be unique');
            return true
        }),
    check('startDate')
        .notEmpty().withMessage('Start date is required')
        .isISO8601().withMessage('Start date must be a valid date'),
    check('endDate')
        .notEmpty().withMessage('End date is required')
        .isISO8601().withMessage('End date must be a valid date')
    // check('academicYearAdmin')
    //     .notEmpty().withMessage('Academic year admin is required')
    //     .isMongoId().withMessage('Academic year admin must be a valid ID')
    //     .custom(async (value) => {
    //         const yearAdminExists = await userModel.findOne({_id: value, role: { $in: ['Admin', 'Teacher'] },isActive:true});
    //         if (!yearAdminExists) throw new Error('Academic year admin not found');
    //         return true
    //     })

    ,validatorMiddleware
]

updateAcademicYearValidator = [
    check('startDate')
        .optional()
        .isISO8601().withMessage('Start date must be a valid date'),
    check('endDate')
        .optional()
        .isISO8601().withMessage('End date must be a valid date'),
    check('academicYearAdmin').optional()
        .isMongoId().withMessage('Academic year admin must be a valid ID')
        .custom(async (value) => {
            const yearAdminExists = await userModel.findOne({_id: value, role: { $in: ['admin', 'teacher'] },isActive:true});
            if (!yearAdminExists) throw new Error('not valid to assign this user as year admin');
            return true
        })
    ,validatorMiddleware
]
        

academicYearIdValidator = [
    check('id')
        .isMongoId().withMessage('Invalid Academic Year ID')
        .custom(async (value) => {
            const academicYear = await academicYearModel.findById(value);
            if (!academicYear) throw new Error('Academic Year not found');
            return true;
        })
    ,validatorMiddleware
]



module.exports = {
    createAcademicYearValidator,
    updateAcademicYearValidator,
    academicYearIdValidator
}