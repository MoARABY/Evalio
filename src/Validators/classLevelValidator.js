const {check} = require('express-validator')
const classLevelModel = require('../../DB/Models/classLevelModel')
const subjectModel = require('../../DB/Models/subjectModel')
const userModel = require('../../DB/Models/userModel')
const programModel = require('../../DB/Models/programModel')
const validatorMiddleware = require('../Middlewares/validatorMiddleware')


createClassValidator = [
    check('name')
        .notEmpty().withMessage('Class Level name is required')
        .custom(async (value) => {
            const classLevel = await classLevelModel.findOne({name: value,program:req.body.program})
            if (classLevel) {
                throw new Error('Class Level name already exists')
            }
            return true
        }),
    check('program')
        .notEmpty().withMessage('Program ID is required')
        .isMongoId().withMessage('Invalid Program ID')
        .custom(async (value) => {
            const program = await programModel.findById(value);
            if (!program) throw new Error('Program not found');
            return true;
        }),
    check('subjects')
        .optional()
        .custom(async (subIds) => {
            Array.isArray(subIds) ?subIds:[subIds]
            const dbSubIds = await subjectModel.find({_id:{$in:subIds}})
            if (dbSubIds.length != subIds.length) {
                throw new Error('One or more Subject IDs are invalid')
            }
            return true
        }),
    check('teachers')
        .optional()
        .custom(async (teacherIds) => {
            Array.isArray(teacherIds) ?teacherIds:[teacherIds]
            const dbTeacherIds = await userModel.find({_id:{$in:teacherIds},role:'teacher'})
            if (dbTeacherIds.length != teacherIds.length) {
                throw new Error('One or more Teacher IDs are invalid')
            }
            return true
        }),
    validatorMiddleware
]

updateClassValidator = [
    check('name')
        .optional()
        .custom(async (value,{req}) => {
            const classLevel = await classLevelModel.findOne({name: value,program:req.body.program})
            if (classLevel && classLevel._id.toString() !== req.params.id) {
                throw new Error('Class Level name already exists')
            }
            return true
        }),
    check('program')
        .optional()
        .isMongoId().withMessage('Invalid Program ID')
        .custom(async (value) => {
            const program = await programModel.findById(value)
            if (!program) throw new Error('Program not found')
            return true;
        }),
    check('subjects')
        .optional()
        .custom(async (subIds) => {
            subIds = Array.isArray(subIds) ? subIds : [subIds];
            const dbSubIds = await subjectModel.find({_id:{$in:subIds}})
            if (dbSubIds.length != subIds.length) {
                throw new Error('One or more Subject IDs are invalid')
            }
            return true
        })
        .custom(async(subIds,{req})=>{
            subIds = Array.isArray(subIds) ? subIds : [subIds];
            // const classSubjects = await classLevelModel.findById(req.params.id).select('subjects')
            // const duplicateSubjects = subIds.filter(id => classSubjects.subjects.includes(id))
            // console.log(classSubjects.subjects)
            const isExistSubject = await classLevelModel.findOne({_id:req.params.id,subjects:{$in:subIds}}).select('subjects')
            if(isExistSubject){
                throw new Error(`Subjects already assigned to class level`)
            }
        }),
    check('teachers')
        .optional()
        .custom(async (teacherIds) => {
            teacherIds = Array.isArray(teacherIds) ? teacherIds : [teacherIds];
            const dbTeacherIds = await userModel.find({_id:{$in:teacherIds},role:'teacher'})
            if (dbTeacherIds.length != teacherIds.length) {
                throw new Error('One or more Teacher IDs are invalid')
            }
            return true
        })
        .custom(async(teacherIds,{req})=>{
            teacherIds = Array.isArray(teacherIds) ? teacherIds : [teacherIds];
            const isExistTeacher = await classLevelModel.findOne({_id:req.params.id,teachers:{$in:teacherIds}}).select('teachers')
            if(isExistTeacher){
                throw new Error(`Teachers already assigned to class level`)
            }
        }),
    validatorMiddleware
]

ClassIdValidator = [
    check('id')
        .isMongoId().withMessage('Invalid Class ID')
        .custom(async (value) => {
            const classLevel = await classLevelModel.findById(value);
            if (!classLevel) throw new Error('Class Level not found');
            return true;
        })
    ,validatorMiddleware
]



module.exports = {
    createClassValidator,
    updateClassValidator,
    ClassIdValidator
}