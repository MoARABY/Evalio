const classLevelModel = require('../../DB/Models/classLevelModel')
const asyncHandler = require('express-async-handler')


const createClassLevel = asyncHandler (async (req, res) => {
    const {name,description,subjects,teachers} = req.body
    const classLevel = await classLevelModel.create({
        name,
        description,
        subjects,
        teachers,
        createdBy: req.user._id
    })
    res.status(201).json({status:"success",msg:"Class Level Created",classLevel})
})

const getClassLevels = asyncHandler (async (req, res) => {
    const classLevels = await classLevelModel.find().populate({path:'subjects',select:'name code'}).populate({path:'teachers',select:'username email'}).populate({path :'createdBy',select:'username email'})   
    if(classLevels.length === 0){
        return res.status(404).json({status:"fail",msg:"No Class Levels Found",classLevels})
    }
    res.status(200).json({status:"success",msg:"Class Levels Found",classLevels})
})

const getClassLevelById = asyncHandler (async (req, res) => {
    const {id} = req.params
    const classLevel = await classLevelModel.findById(id).populate({path:'subjects',select:'name code'}).populate({path:'teachers',select:'username email'}).populate({path :'createdBy',select:'username email'})
    if(!classLevel){
        return res.status(404).json({status:"fail",msg:`No Class Level Found for this id: ${id}`})
    }
    res.status(200).json({status:"success",msg:"Class Level Found",classLevel})
})

const updateClassLevel = asyncHandler (async (req, res) => {
    const {id} = req.params
    const {name,description} = req.body

    const classLevel = await classLevelModel.findByIdAndUpdate(id,
        {name,description},{new:true,runValidators:true})
    classLevel ? res.status(200).json({status:"success",msg:"Class Level Updated",classLevel}):res.status(404).json({status:"fail",msg:`No Class Level Found for this id: ${id}`})
})
const addSubjectsToClassLevel = asyncHandler (async (req, res) => {
    const {id} = req.params
    let {subjects} = req.body
    subjects = Array.isArray(subjects) ? subjects : [subjects]
    const classLevel = await classLevelModel.findByIdAndUpdate(id,
        {$addToSet:{subjects:{$each:subjects}}},{new:true,runValidators:true})
    classLevel ? res.status(200).json({status:"success",msg:"Subjects Added to Class Level",classLevel}):res.status(404).json({status:"fail",msg:`No Class Level Found for this id: ${id}`})
})

const addTeachersToClassLevel = asyncHandler (async (req, res) => {
    const {id} = req.params
    let {teachers} = req.body
    teachers = Array.isArray(teachers) ? teachers : [teachers]
    const classLevel = await classLevelModel.findByIdAndUpdate(id,
        {$addToSet:{teachers:{$each:teachers}}},{new:true,runValidators:true})
    classLevel ? res.status(200).json({status:"success",msg:"Teachers Added to Class Level",classLevel}):res.status(404).json({status:"fail",msg:`No Class Level Found for this id: ${id}`})
})

const deleteClassLevel = asyncHandler (async (req, res) => {
    const {id} = req.params
    const classLevel = await classLevelModel.findByIdAndDelete(id)
    classLevel ? res.status(200).json({status:"success",msg:"Class Level Deleted"}):res.status(404).json({status:"fail",msg:`No Class Level Found for this id: ${id}`})
})  

module.exports = {
    createClassLevel,
    getClassLevels,
    getClassLevelById,
    updateClassLevel,
    addSubjectsToClassLevel,
    addTeachersToClassLevel,
    deleteClassLevel
}