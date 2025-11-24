const {createProgram,getPrograms,getProgramById,updateProgram,deleteProgram} = require('../Controllers/programController')
const { createProgramValidator,updateProgramValidator,programIdValidator} = require('../Validators/programValidator')
const {verifyToken,allowedTo} = require('../Middlewares/verifyToken')
const cacheMiddleware = require('../Middlewares/cacheMiddleware')

const router = require('express').Router()

router.route('/')
    .post(allowedTo('admin'),createProgramValidator,createProgram)
    .get(verifyToken,cacheMiddleware('programs'),getPrograms)
router.route('/:id')
    .get(verifyToken,programIdValidator,cacheMiddleware('program','id'),getProgramById)
    .put(allowedTo('admin'),programIdValidator,updateProgramValidator,updateProgram)
    .delete(allowedTo('admin'),programIdValidator,deleteProgram)

module.exports = router