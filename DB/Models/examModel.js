const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Exam title is required']
    },
    description: { 
        type: String,
        minlength: [10, 'Description must be at least 10 characters long']
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: [true, 'Subject is required'],
    },
    classLevel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClassLevel',
        required: [true, 'Class Level is required'],
    },
    academicYear: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AcademicYear',
        required: [true, 'Academic Year is required'],
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Created By is required'],
    },
    examDate: { type: Date, required: [true, 'Exam Date is required'] },
    duration: { type: String, required: [true, 'Duration is required'] },
    totalMarks: { type: Number, required: [true, 'Total Marks is required'] },
    passMarks: { type: Number, required: [true, 'Pass Marks is required'] },
    isPublished: { type: Boolean, default: false },
    // questions: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Question',
    // }],
}, { timestamps: true })


examSchema.set('toJSON', { virtuals: true })
examSchema.set('toObject', { virtuals: true })

examSchema.virtual('questions', {
    ref: 'Question',
    localField: '_id',
    foreignField: 'exam'
})


examSchema.post('findOne', async function (doc, next) {
    if (!doc) return next();
    await doc.populate({path: 'questions', select: 'text questionType'})
    next();
})

module.exports = mongoose.model('Exam', examSchema);