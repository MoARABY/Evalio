const subjectModel = require('../../DB/Models/subjectModel')
const asyncHandler = require('express-async-handler')



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
    newSubject ? res.status(201).json({ status: 'success', message: 'Subject created successfully', data: newSubject }):res.status(400).json({ status: 'fail', message: 'Subject creation failed' })
})

const getSubjects = asyncHandler (async (req, res) => {
    const subjects = await subjectModel.find().populate({path:'academicTerm',select:'name year'}).populate({path:'createdBy',select:'username email'})
    if(subjects.length ===0){
        return res.status(404).json({ status: 'fail', message: 'No subjects found' })
    }
    res.status(200).json({ status: 'success', results: subjects.length, data: subjects })
})

const getSubjectById = asyncHandler (async (req, res) => {
    const { id } = req.params
    const subject = await subjectModel.findById(id).populate({path:'academicTerm',select:'name year'}).populate({path:'createdBy',select:'username email'})
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
    updatedSubject ? res.status(200).json({ status: 'success', message: 'Subject updated successfully', data: updatedSubject }) : res.status(404).json({ status: 'fail', message: 'Subject not found' })
})

const deleteSubject = asyncHandler (async (req, res, next) => {
    const { id } = req.params
    const deletedSubject = await subjectModel.findByIdAndDelete(id)
    deletedSubject ? res.status(200).json({ status: 'success', message: 'Subject deleted successfully' }) : res.status(404).json({ status: 'fail', message: 'Subject not found' })
})

module.exports = {
    createSubject,
    getSubjects,
    getSubjectById,
    updateSubjectById,
    deleteSubject
}