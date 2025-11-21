const {createExam,getExams,getExamById,getExamBySubjectId,updateExam,deleteExam,publishExam,unpublishExam} = require('../Controllers/examController')
const { createExamValidator,updateExamValidator,examIdValidator} = require('../Validators/examValidator')
const {verifyToken,allowedTo} = require('../Middlewares/verifyToken')

const router = require('express').Router()

router.route('/')
    .post(allowedTo('teacher'),createExamValidator,createExam)
    .get(allowedTo('teacher','admin'),getExams)
router.route('/:id')
    .get(allowedTo('teacher','admin'),examIdValidator,getExamById)
    .put(allowedTo('teacher'),examIdValidator,updateExamValidator,updateExam)
    .delete(allowedTo('admin','teacher'),examIdValidator,deleteExam)
router.route('/subject/:subjectId')
    .get(verifyToken,getExamBySubjectId)
router.route('/:id/publish')
    .put(allowedTo('teacher'),examIdValidator,publishExam)
router.route('/:id/unpublish')
    .put(allowedTo('teacher'),examIdValidator,unpublishExam)

module.exports = router