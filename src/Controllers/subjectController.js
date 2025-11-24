const subjectModel = require('../../DB/Models/subjectModel')
const asyncHandler = require('express-async-handler')
const apiFeatures = require('../Utils/appFeatures')
const {client} = require('../../DB/redisConfig')



const createSubject = asyncHandler (async (req, res) => {
    const { name, code, description, academicTerm } = req.body
    const newSubject = new subjectModel({
        name,
        code,
        description,
        academicTerm,
        createdBy: req.user._id
    })
    await newSubject.save()
    await client.del('subjects')
    newSubject ? res.status(201).json({ status: 'success', message: 'Subject created successfully', data: newSubject }):res.status(400).json({ status: 'fail', message: 'Subject creation failed' })
})

const getSubjects = asyncHandler (async (req, res) => {
    const mongooseQuery = subjectModel.find()
    const features = new apiFeatures (req.query, mongooseQuery)
    .search('subjectModel')
    .filter()
    .sort()
    .limitFields()
    .paginate()
    
    const subjects = await features.mongooseQuery.populate({path:'academicTerm',select:'name year'}).populate({path:'createdBy',select:'username email'})
    // const subjects = await subjectModel.find().populate({path:'academicTerm',select:'name year'}).populate({path:'createdBy',select:'username email'})
    if(subjects.length ===0){
        return res.status(404).json({ status: 'fail', message: 'No subjects found' })
    }
    if(res.locals.cacheKey) {
        await client.setEx(res.locals.cacheKey, 3600, JSON.stringify(subjects))
    }
    res.status(200).json({ status: 'success', results: subjects.length, data: subjects })
})

const getSubjectById = asyncHandler (async (req, res) => {
    const { id } = req.params
    const subject = await subjectModel.findById(id).populate({path:'academicTerm',select:'name year'}).populate({path:'createdBy',select:'username email'})
    if(res.locals.cacheKey) {
        await client.setEx(res.locals.cacheKey, 3600, JSON.stringify(subject))
    }
    subject ? res.status(200).json({ status: 'success', data: subject }) : res.status(404).json({ status: 'fail', message: 'Subject not found' })
})

const updateSubjectById = asyncHandler (async (req, res) => {
    const { id } = req.params
    const { name, code, description, academicTerm } = req.body
    const updatedSubject = await subjectModel.findByIdAndUpdate(id, {
        name,
        code,
        description,
        academicTerm
    }, { new: true, runValidators: true })
    if(res.locals.cacheKey) {
        await client.del(res.locals.cacheKey)
    }
    updatedSubject ? res.status(200).json({ status: 'success', message: 'Subject updated successfully', data: updatedSubject }) : res.status(404).json({ status: 'fail', message: 'Subject not found' })
})

const deleteSubject = asyncHandler (async (req, res, next) => {
    const { id } = req.params
    const deletedSubject = await subjectModel.findByIdAndDelete(id)
    await client.del('subjects')
    deletedSubject ? res.status(200).json({ status: 'success', message: 'Subject deleted successfully' }) : res.status(404).json({ status: 'fail', message: 'Subject not found' })
})

module.exports = {
    createSubject,
    getSubjects,
    getSubjectById,
    updateSubjectById,
    deleteSubject
}