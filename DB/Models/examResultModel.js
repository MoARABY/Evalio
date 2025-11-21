const mongoose = require('mongoose');

const examResultSchema = new mongoose.Schema({
    student :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Student is required']
    },
    exam: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: [true, 'Exam is required']
    },
    score: {
        type: Number,
        required: [true, 'Score is required']
    },
    totalMarks: { type: Number, required: true },
    percentage: { type: Number, required: true },
    grade: { type: String },
    isPassed: { type: Boolean, required: true },
    remarkRequested: { 
        type: Boolean, 
        default: false 
    }
}, { timestamps: true })

module.exports = mongoose.model('ExamResult', examResultSchema)