const examResultModel = require('../../DB/Models/examResultModel')
const asyncHandler = require('express-async-handler')


const getExamsResults = asyncHandler (async (req, res) => {
    if(req.user.role === 'student') {
        const results = await examResultModel.find({student: req.user._id,isPublished: true}).populate({path:'exam',populate:[{path :'createdBy',select:'username email'},{path:'subject',select:'name code'},{path:'classLevel',populate:{path:'program', model: 'Program',select:'name'},select:'name code'},{path:'academicYear',select:'name startYear endYear'}]}).lean()
        if(results.length === 0){
            return res.status(404).json({status:"fail",msg:"No Exam Results Found",results})
        }
        return  res.status(200).json({status:"success",msg:"Exam Results Found",results})
    }
    const results = await examResultModel.find().populate({path:'student',select:'username email'}).populate({path:'exam',populate:[{path :'createdBy',select:'username email'},{path:'subject',select:'name code'},{path:'classLevel',populate:{path:'program', model: 'Program',select:'name'},select:'name code'},{path:'academicYear',select:'name startYear endYear'}]}).lean()
    if(results.length === 0){
        return res.status(404).json({status:"fail",msg:"No Exam Results Found",results})
    }
    res.status(200).json({status:"success",msg:"Exam Results Found",results})
})

const getExamResultById = asyncHandler (async (req, res) => {
    const {id} = req.params
    let result
    if(req.user.role === 'student') {
        result = await examResultModel.findById(id).populate({path:'exam',populate:[{path :'createdBy',select:'username email'},{path:'subject',select:'name code'},{path:'classLevel',populate:{path:'program', model: 'Program',select:'name'},select:'name code'},{path:'academicYear',select:'name startYear endYear'}]}).lean()
        if(!result || !result.isPublished){
            return res.status(404).json({status:"fail",msg:`No exam Found for this id: ${id}`})
        }
    }
    result = await examResultModel.findById(id).populate({path:'student',select:'username email'}).populate({path:'exam',populate:[{path :'createdBy',select:'username email'},{path:'subject',select:'name code'},{path:'classLevel',populate:{path:'program', model: 'Program',select:'name'},select:'name code'},{path:'academicYear',select:'name startYear endYear'}]})
    if(!result){
        return res.status(404).json({status:"fail",msg:`No exam Found for this id: ${id}`})
    }
    res.status(200).json({status:"success",msg:"examResult Found",result})
})

const updateExamResult = asyncHandler (async (req, res) => {
    const {id} = req.params
    const  result = await examResultModel.findById(id)
    if(!result){
        return res.status(404).json({status:"fail",msg:`No exam Result Found for this id: ${id}`})
    }
    if(result.remarkRequested && !result.isRemarked){
        const {score,grade,percentage,isPassed,correctAnswers,wrongAnswers} = req.body
        result.score = score || result.score
        result.grade = grade || result.grade
        result.percentage = percentage || result.percentage
        result.isPassed = isPassed ?? result.isPassed
        result.correctAnswers = correctAnswers || result.correctAnswers
        result.wrongAnswers = wrongAnswers || result.wrongAnswers
        result.isRemarked = true
        await result.save()
        return res.status(200).json({status:"success",msg:"exam Result Updated after remark",result})
    }
    return res.status(400).json({status:"fail",msg:"No remark request found for this exam result"})
    })

const deleteExamResult = asyncHandler (async (req, res) => {
    const {id} = req.params
    await examResultModel.findByIdAndDelete(id)
    res.status(200).json({status:"success",msg:"exam Result Deleted"})
})    

const publishExamResult = asyncHandler (async (req, res) => {
    const {id} = req.params
    const examResult  = await examResultModel.findById(id)
    if(!examResult ){
        return res.status(404).json({status:"fail",msg:`No exam Found for this id: ${id}`})
    }
    examResult.isPublished = true
    await examResult.save()
    res.status(200).json({status:"success",msg:"exam Published",examResult})
})

const unpublishExamResult = asyncHandler (async (req, res) => {
    const {id} = req.params
    const examResult  = await examResultModel.findById(id)
    if(!examResult ){
        return res.status(404).json({status:"fail",msg:`No exam Found for this id: ${id}`})
    }
    examResult .isPublished = false
    await examResult .save()
    res.status(200).json({status:"success",msg:"exam Unpublished",examResult })
})

const getExamResultByStudentId = asyncHandler (async (req, res) => { 
    const {studentId} = req.params
    const results = await examResultModel.find({student: studentId,isPublished: true}).populate({path:'exam',populate:[{path :'createdBy',select:'username email'},{path:'subject',select:'name code'},{path:'classLevel',populate:{path:'program', model: 'Program',select:'name'},select:'name code'},{path:'academicYear',select:'name startYear endYear'}]}).lean()
    if(results.length === 0){
        return res.status(404).json({status:"fail",msg:"No Exam Results Found",results})
    }
    res.status(200).json({status:"success",msg:"Exam Results Found",results})
})

module.exports = {
    getExamsResults,
    getExamResultById,
    updateExamResult,
    deleteExamResult,
    publishExamResult,
    unpublishExamResult,
    getExamResultByStudentId
}