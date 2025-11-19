const {check} = require('express-validator')
const programModel = require('../../DB/Models/programModel')
const validatorMiddleware = require('../Middlewares/validatorMiddleware')




createProgramValidator = [
    check('name')
        .notEmpty().withMessage('Program name is required')
        .custom(async (value) => {
            const programExists = await programModel.findOne({name: value });
            if (programExists) throw new Error('Program name must be unique');
            return true
        }),
    check('description')
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 10 }).withMessage('Description should be at least 10 characters long')
    ,validatorMiddleware
]

updateProgramValidator = [
    check('name')
        .optional()
        .custom(async (value, { req }) => {
            const program = await programModel.findOne({name: value })
            if (program && program._id.toString() !== req.params.id) {
                throw new Error('Program name must be unique');
            }}),
    check('description')
        .optional()
        .isLength({ min: 10 }).withMessage('Description should be at least 10 characters long')
    ,validatorMiddleware
]

programIdValidator = [
    check('id')
        .isMongoId().withMessage('Invalid Program ID')
        .custom(async (value) => {
            const program = await programModel.findById(value);
            if (!program) throw new Error('Program not found');
            return true;
        })
    ,validatorMiddleware
]



module.exports = {
    createProgramValidator,
    updateProgramValidator,
    programIdValidator
}