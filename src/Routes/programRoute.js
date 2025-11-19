const {createProgram,getPrograms,getProgramById,updateProgram,deleteProgram} = require('../Controllers/programController')
const { createProgramValidator,updateProgramValidator,programIdValidator} = require('../Validators/programValidator')
const {verifyToken,allowedTo} = require('../Middlewares/verifyToken')

const router = require('express').Router()

router.route('/')
    .post(allowedTo('admin'),createProgramValidator,createProgram)
    .get(verifyToken,getPrograms)
router.route('/:id')
    .get(verifyToken,programIdValidator,getProgramById)
    .put(allowedTo('admin'),programIdValidator,updateProgramValidator,updateProgram)
    .delete(allowedTo('admin'),programIdValidator,deleteProgram)

module.exports = router