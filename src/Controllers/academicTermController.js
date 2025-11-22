
const academicTermModel = require('../../DB/Models/academicTermModel')
const asyncHandler = require('express-async-handler')
const apiFeatures = require('../Utils/appFeatures')



const createAcademicTerm = asyncHandler (async (req, res) => {
    const { name,description, startDate, endDate,academicYear } = req.body;
    const createdBy = req.user._id;

    const newAcademicTerm = new academicTermModel({
        name,
        description,
        startDate,
        endDate,
        academicYear,
        createdBy
    });
    await newAcademicTerm.save();
    newAcademicTerm ? res.status(201).json({ status: 'success', data: newAcademicTerm }): res.status(400).json({ status: 'fail', msg: 'Failed to create academic Term' });
})


const getAcademicTerms = asyncHandler (async (req, res ) => {
    const mongooseQuery = academicTermModel.find()
    const apiFeature = new apiFeatures (req.query, mongooseQuery)
    .search('academicTermModel')
    .filter()
    .sort()
    .limitFields()
    .paginate()
    const academicTerms = await apiFeature.mongooseQuery.populate({ path: 'academicYear', select: 'name' });
    // const academicTerms = await academicTermModel.find().populate({ path: 'academicYear', select: 'name' });
    academicTerms.length > 0 ?res.status(200).json({ status: 'success', results: academicTerms.length, data: academicTerms }) : res.status(404).json({ status: 'fail', msg: 'No Academic Terms found' });

})

const getAcademicTermById = asyncHandler (async (req, res ) => {
    const { id } = req.params;
    const academicTerm = await academicTermModel.findById(id).populate({ path: 'academicYear', select: 'name' });
    academicTerm ? res.status(200).json({ status: 'success', data: academicTerm }) : res.status(404).json({ status: 'fail', msg: 'Academic Term not found' });
})


const updateAcademicTermById = asyncHandler (async (req, res) => {
    const { id } = req.params;
    const { name,description, startDate, endDate, academicYear } = req.body;

    const updatedAcademicTerm = await academicTermModel.findByIdAndUpdate(
        id,
        { name, description, startDate, endDate, academicYear },
        { new: true, runValidators: true }
    );
    updatedAcademicTerm ? res.status(200).json({ status: 'success', data: updatedAcademicTerm }) : res.status(404).json({ status: 'fail', msg: 'Academic Term not found' });
})

const deleteAcademicTermById = asyncHandler (async (req, res) => {
    const { id } = req.params;
    const deletedAcademicTerm = await academicTermModel.findByIdAndDelete(id);
    deletedAcademicTerm ? res.status(200).json({ status: 'success', msg: 'Academic Term deleted successfully' }) : res.status(404).json({ status: 'fail', msg: 'Academic Term not found' });
})



module.exports = {
    createAcademicTerm,
    getAcademicTerms,
    getAcademicTermById,
    updateAcademicTermById,
    deleteAcademicTermById
}
