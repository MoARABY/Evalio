const {createSubject,getSubjects,getSubjectById,updateSubjectById,deleteSubject} = require('../Controllers/subjectController')
const {createSubjectValidator, updateSubjectValidator, subjectIdValidator,setAcademicTermIdInBody} = require('../Validators/subjectValidator')
const {verifyToken,allowedTo} = require('../Middlewares/verifyToken')


const router = require('express').Router({mergeParams:true})


router.route('/')
    .post(allowedTo('admin'),setAcademicTermIdInBody,createSubjectValidator,createSubject)
    .get(verifyToken,getSubjects)

router.route('/:id')
    .get(verifyToken,subjectIdValidator,getSubjectById)
    .put(allowedTo('admin'),subjectIdValidator,updateSubjectValidator,updateSubjectById)
    .delete(allowedTo('admin'),subjectIdValidator,deleteSubject)


module.exports = router