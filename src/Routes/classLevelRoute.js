const {createClassLevel,getClassLevels,getClassLevelById,updateClassLevel,addSubjectsToClassLevel,addTeachersToClassLevel,deleteClassLevel} = require('../Controllers/classLevelController')
const {createClassValidator,updateClassValidator,ClassIdValidator} = require('../Validators/classLevelValidator')
const {verifyToken,allowedTo} = require('../Middlewares/verifyToken')

const router = require('express').Router()

router.route('/')
    .post(allowedTo('admin'),createClassValidator,createClassLevel)
    .get(verifyToken,getClassLevels)
router.route('/:id')
    .get(verifyToken,ClassIdValidator,getClassLevelById)
    .put(allowedTo('admin'),ClassIdValidator,updateClassValidator,updateClassLevel)
    .delete(allowedTo('admin'),ClassIdValidator,deleteClassLevel)

router.route('/:id/subjects')
    .put(allowedTo('admin'),ClassIdValidator,updateClassValidator,addSubjectsToClassLevel)
    
router.route('/:id/teachers')
    .put(allowedTo('admin'),ClassIdValidator,updateClassValidator,addTeachersToClassLevel)

module.exports = router