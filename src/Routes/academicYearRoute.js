const {createAcademicYear,getAcademicYears,getAcademicYearById,updateAcademicYearById,asscociateYearAdmin,deleteAcademicYearById} = require('../Controllers/academicYearController')
const {createAcademicYearValidator,updateAcademicYearValidator,academicYearIdValidator} = require('../Validators/academicYearValidator')    
const {verifyToken,allowedTo} = require('../Middlewares/verifyToken')
const router = require('express').Router() 



router.route('/')
    .post(allowedTo('admin'),createAcademicYearValidator, createAcademicYear)
    .get(verifyToken, getAcademicYears)

router.route('/:id')
    .get(verifyToken, academicYearIdValidator, getAcademicYearById)
    .put(allowedTo('admin'), academicYearIdValidator, updateAcademicYearValidator, updateAcademicYearById)
    .delete(allowedTo('admin'), academicYearIdValidator, deleteAcademicYearById)

router.route('/:id/associate')
    .put(allowedTo('admin'),academicYearIdValidator,updateAcademicYearValidator, asscociateYearAdmin)

module.exports = router