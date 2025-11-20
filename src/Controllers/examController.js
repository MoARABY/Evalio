const examModel = require('../../DB/Models/examModel')
const userModel = require('../../DB/Models/userModel')
const asyncHandler = require('express-async-handler')


const createExam = asyncHandler (async (req, res) => {
    const {title,description,subject,classLevel,academicYear,passMarks,totalMarks,duration,examDate} = req.body
    if(!title || !subject || !classLevel || !academicYear || !description || !passMarks || !totalMarks || !duration || !examDate){  
        return res.status(400).json({status:"fail",msg:"Please provide all required fields"})
    }
    const user  = await userModel.findOne({_id:req.user._id,role:'teacher'})
    if(!user) return res.status(404).json({status:"fail",msg:"exam should be created by teachers only"})
    const Exam = await examModel.create({
        title,
        description,
        subject,
        classLevel,
        academicYear,
        examDate,
        duration,
        totalMarks,
        passMarks,
        createdBy: req.user._id
    })
    res.status(201).json({status:"success",msg:"Class Level Created",Exam})
})

const getExams = asyncHandler (async (req, res) => {
    const exams = await examModel.find().populate({path :'createdBy',select:'username email'}).populate({path:'subject',select:'name code'}).populate({path:'classLevel',populate:{path:'program', model: 'Program',select:'name'},select:'name code'}).populate({path:'academicYear',select:'name startYear endYear'})         
    if(exams.length === 0){
        return res.status(404).json({status:"fail",msg:"No Exams Found",exams})
    }
    res.status(200).json({status:"success",msg:"Exams Found",exams})
})

const getExamById = asyncHandler (async (req, res) => {
    const {id} = req.params
    const exam = await examModel.findById(id).populate({path :'createdBy',select:'username email'}).populate({path:'subject',select:'name code'}).populate({path:'classLevel',populate:{path:'program', model: 'Program',select:'name'},select:'name code'}).populate({path:'academicYear',select:'name startYear endYear'})
    if(!exam){
        return res.status(404).json({status:"fail",msg:`No exam Found for this id: ${id}`})
    }
    res.status(200).json({status:"success",msg:"exam Found",exam})
})

const updateExam = asyncHandler (async (req, res) => {
    const {id} = req.params
    const {title,description,subject,classLevel,academicYear,passMarks,totalMarks,duration,examDate} = req.body

    const exam = await examModel.findByIdAndUpdate(id,
        {title,description,subject,classLevel,academicYear,passMarks,totalMarks,duration,examDate},{new:true,runValidators:true})
    exam ? res.status(200).json({status:"success",msg:"exam Updated",exam}):res.status(404).json({status:"fail",msg:`No exam Found for this id: ${id}`})
})

const deleteExam = asyncHandler (async (req, res) => {
    const {id} = req.params
    const exam = await examModel.findByIdAndDelete(id)
    exam ? res.status(200).json({status:"success",msg:"exam Deleted"}):res.status(404).json({status:"fail",msg:`No exam Found for this id: ${id}`})
})  

const publishExam = asyncHandler (async (req, res) => {
    const {id} = req.params
    const exam = await examModel.findById(id)
    exam.isPublished = true
    await exam.save()
    res.status(200).json({status:"success",msg:"exam Published",exam})
})

const unpublishExam = asyncHandler (async (req, res) => {
    const {id} = req.params
    const exam = await examModel.findById(id)
    exam.isPublished = false
    await exam.save()
    res.status(200).json({status:"success",msg:"exam Unpublished",exam})
})

const getExamBySubjectId = asyncHandler (async (req, res) => { 
    const {subjectId} = req.params
    const exams = await examModel.find({subject:subjectId}).populate({path :'createdBy',select:'username email'}).populate({path:'subject',select:'name code'}).populate({path:'classLevel',populate:{path:'program', model: 'Program',select:'name'},select:'name code'}).populate({path:'academicYear',select:'name startYear endYear'})
    if(exams.length === 0){
        return res.status(404).json({status:"fail",msg:`No exam Found for this subject id: ${subjectId}`})
    }
    res.status(200).json({status:"success",msg:"exam Found",exams})
})

module.exports = {
    createExam,
    getExams,
    getExamById,
    getExamBySubjectId,
    updateExam,
    deleteExam,
    publishExam,
    unpublishExam
}