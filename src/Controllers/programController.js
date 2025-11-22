const programModel = require('../../DB/Models/programModel')
const asyncHandler = require('express-async-handler')
const apiFeatures = require('../Utils/appFeatures')


const createProgram = asyncHandler (async (req, res) => {
    const {name,description} = req.body
    const Program = await programModel.create({
        name,
        description,
        createdBy: req.user._id
    })
    res.status(201).json({status:"success",msg:"Class Level Created",Program})
})

const getPrograms = asyncHandler (async (req, res) => {

    const mongooseQuery = programModel.find()
    const apiFeature = new apiFeatures (req.query, mongooseQuery)
    .search('programModel')
    .filter()
    .sort()
    .limitFields()
    .paginate()

    const Programs = await apiFeature.mongooseQuery.populate({path :'createdBy',select:'username email'})
    // const Programs = await programModel.find().populate({path :'createdBy',select:'username email'})

    if(Programs.length === 0){
        return res.status(404).json({status:"fail",msg:"No Programs Found",Programs})
    }
    res.status(200).json({status:"success",msg:"Programs Found",Programs})
})

const getProgramById = asyncHandler (async (req, res) => {
    const {id} = req.params
    const Program = await programModel.findById(id).populate({path :'createdBy',select:'username email'})
    if(!Program){
        return res.status(404).json({status:"fail",msg:`No Program Found for this id: ${id}`})
    }
    res.status(200).json({status:"success",msg:"Program Found",Program})
})

const updateProgram = asyncHandler (async (req, res) => {
    const {id} = req.params
    const {name,description} = req.body

    const Program = await programModel.findByIdAndUpdate(id,
        {name,description},{new:true,runValidators:true})
    Program ? res.status(200).json({status:"success",msg:"Program Updated",Program}):res.status(404).json({status:"fail",msg:`No Program Found for this id: ${id}`})
})

const deleteProgram = asyncHandler (async (req, res) => {
    const {id} = req.params
    const Program = await programModel.findByIdAndDelete(id)
    Program ? res.status(200).json({status:"success",msg:"Program Deleted"}):res.status(404).json({status:"fail",msg:`No Program Found for this id: ${id}`})
})  

module.exports = {
    createProgram,
    getPrograms,
    getProgramById,
    updateProgram,
    deleteProgram
}