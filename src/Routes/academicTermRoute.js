const {createAcademicTerm,getAcademicTerms,getAcademicTermById,updateAcademicTermById,deleteAcademicTermById} = require('../Controllers/academicTermController');
const {createAcademicTermValidator,updateAcademicTermValidator,academicTermIdValidator} = require('../Validators/academicTermValidator');
const {verifyToken,allowedTo} = require('../Middlewares/verifyToken')
const router = require('express').Router()

router.route('/')
    .post(allowedTo('admin'),createAcademicTermValidator, createAcademicTerm)
    .get(verifyToken, getAcademicTerms)
router.route('/:id')
    .get(verifyToken, academicTermIdValidator, getAcademicTermById)
    .put(allowedTo('admin'), academicTermIdValidator, updateAcademicTermValidator, updateAcademicTermById)
    .delete(allowedTo('admin'), academicTermIdValidator, deleteAcademicTermById)


module.exports = router