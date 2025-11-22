const {getExamsResults,getExamResultById,updateExamResult,deleteExamResult,publishExamResult,unpublishExamResult,getExamResultByStudentId} = require('../Controllers/examResultController')  
const { createExamValidator,updateExamValidator,examIdValidator} = require('../Validators/examValidator')
const {verifyToken,allowedTo} = require('../Middlewares/verifyToken')

const router = require('express').Router()

router.route('/')
    .get(verifyToken,getExamsResults)
router.route('/:id')
    .get(verifyToken,examIdValidator,getExamResultById)
    .put(allowedTo('teacher'),examIdValidator,updateExamValidator,updateExamResult)
    .delete(allowedTo('admin','teacher'),examIdValidator,deleteExamResult)
router.route('/:id/publish')
    .put(allowedTo('teacher'),examIdValidator,publishExamResult)
router.route('/:id/unpublish')
    .put(allowedTo('teacher'),examIdValidator,unpublishExamResult)
router.route('/:studentId')
    .get(verifyToken,getExamResultByStudentId)
module.exports = router