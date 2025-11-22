const academicYearModel = require('../../DB/Models/academicYearModel');
const asyncHandler = require('express-async-handler')
const apiFeatures = require('../Utils/appFeatures')




const createAcademicYear = asyncHandler (async (req, res) => {
    const { name, startDate, endDate } = req.body;
    const academicYearAdmin = req.user._id;

    const newAcademicYear = new academicYearModel({
        name,
        startDate,
        endDate,
        academicYearAdmin
    });
    await newAcademicYear.save();
    newAcademicYear ? res.status(201).json({ status: 'success', data: newAcademicYear }): res.status(400).json({ status: 'fail', msg: 'Failed to create academic year' });
})

const getAcademicYears = asyncHandler (async (req, res ) => {
    const mongooseQuery = academicYearModel.find()
    const apiFeature = new apiFeatures (req.query, mongooseQuery)
    .search('academicYearModel')
    .filter()
    .sort()
    .limitFields()
    .paginate()
    const academicYears = await apiFeature.mongooseQuery.populate({ path: 'academicYearAdmin', select: 'username email' });
    // const academicYears = await academicYearModel.find().populate({ path: 'academicYearAdmin', select: 'username email' });
    academicYears.length > 0 ?res.status(200).json({ status: 'success', results: academicYears.length, data: academicYears }) : res.status(404).json({ status: 'fail', msg: 'No Academic Years found' });

})

const getAcademicYearById = asyncHandler (async (req, res ) => {
    const { id } = req.params;
    const academicYear = await academicYearModel.findById(id).populate({ path: 'academicYearAdmin', select: 'username email' });
    academicYear ? res.status(200).json({ status: 'success', data: academicYear }) : res.status(404).json({ status: 'fail', msg: 'Academic Year not found' });
})

const asscociateYearAdmin = asyncHandler (async (req, res ) => {
    const {id} = req.params
    const academicYear = await academicYearModel.findById(id);
    academicYear.academicYearAdmin = req.body.academicYearAdmin;
    await academicYear.save();
    academicYear ? res.status(200).json({ status: 'success', data: academicYear }) : res.status(404).json({ status: 'fail', msg: 'Academic Year not found' });
})

const updateAcademicYearById = asyncHandler (async (req, res) => {
    const { id } = req.params;
    const { name, startDate, endDate } = req.body;

    const updatedAcademicYear = await academicYearModel.findByIdAndUpdate(
        id,
        { name, startDate, endDate },
        { new: true, runValidators: true }
    );
    updatedAcademicYear ? res.status(200).json({ status: 'success', data: updatedAcademicYear }) : res.status(404).json({ status: 'fail', msg: 'Academic Year not found' });
})

const deleteAcademicYearById = asyncHandler (async (req, res) => {
    const { id } = req.params;
    const deletedAcademicYear = await academicYearModel.findByIdAndDelete(id);
    deletedAcademicYear ? res.status(200).json({ status: 'success', msg: 'Academic Year deleted successfully' }) : res.status(404).json({ status: 'fail', msg: 'Academic Year not found' });
})



module.exports = {
    createAcademicYear,
    getAcademicYears,
    getAcademicYearById,
    updateAcademicYearById,
    deleteAcademicYearById,
    asscociateYearAdmin
}
