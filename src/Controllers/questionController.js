const questionModel = require('../../DB/Models/questionModel')
const userModel = require('../../DB/Models/userModel')
const asyncHandler = require('express-async-handler')
const apiFeatures = require('../Utils/appFeatures')


const createQuestion = asyncHandler (async (req, res) => {
    const {text,questionType,options,correctAnswer,marks,exam} = req.body
    const user = await userModel.findOne({_id:req.user._id,role:'teacher'})
    if(!user){
        return  res.status(403).json({status:"fail",msg:"Only teachers can create questions"})
    }
    const question = await questionModel.create({
        text,
        questionType,
        options,
        correctAnswer,
        marks,
        exam,
        createdBy:req.user._id
    })
    res.status(201).json({status:"success",msg:"Question Created",question})
})

const getQuestions = asyncHandler (async (req, res) => {
    const mongooseQuery = questionModel.find()
    const features = new apiFeatures(req.query, mongooseQuery)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .search('questionModel')

    const questions = await features.mongooseQuery.populate({path :'createdBy',select:'username email'}).populate({path:'exam',select:'title',populate:{path:'subject',select:'name'} })    
    // const questions = await questionModel.find().populate({path :'createdBy',select:'username email'}).populate({path:'exam',select:'title',populate:{path:'subject',select:'name'} })
    if(questions.length === 0){
        return res.status(404).json({status:"fail",msg:"No Questions Found",questions})
    }
    res.status(200).json({status:"success",msg:"Questions Found",questions})
})

const getQuestionById = asyncHandler (async (req, res) => {
    const {id} = req.params
    const question = await questionModel.findById(id).populate({path :'createdBy',select:'username email'}).populate({path:'exam',select:'title',populate:{path:'subject',select:'name'} })
    if(!question){
        return res.status(404).json({status:"fail",msg:`No Question Found for this id: ${id}`})
    }
    res.status(200).json({status:"success",msg:"Question Found",question})
})

const getQuestionsByExamId = asyncHandler (async (req, res) => {
    const {examId} = req.params
    const questions = await questionModel.find({exam:examId}).populate({path :'createdBy',select:'username email'}).populate({path:'exam',select:'title',populate:{path:'subject',select:'name'} }) 
    if(questions.length === 0){
        return res.status(404).json({status:"fail",msg:`No Questions Found for this exam id: ${examId}`})
    }
    res.status(200).json({status:"success",msg:"Questions Found",questions})
})

const updateQuestion = asyncHandler (async (req, res) => {
    const {id} = req.params
    const {text,questionType,options,correctAnswer,marks} = req.body

    const question = await questionModel.findByIdAndUpdate(id,
        {text,questionType,options,correctAnswer,marks},{new:true,runValidators:true})
    question ? res.status(200).json({status:"success",msg:"Question Updated",question}):res.status(404).json({status:"fail",msg:`No Question Found for this id: ${id}`})
})

const deleteQuestion = asyncHandler (async (req, res) => {
    const {id} = req.params
    const question = await questionModel.findByIdAndDelete(id)
    question ? res.status(200).json({status:"success",msg:"Question Deleted"}):res.status(404).json({status:"fail",msg:`No Question Found for this id: ${id}`})
})  

module.exports = {
    createQuestion,
    getQuestions,
    getQuestionById,
    getQuestionsByExamId,
    updateQuestion,
    deleteQuestion
}