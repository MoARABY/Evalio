const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    text: { 
        type: String, 
        required: [true, 'Question text is required']
    },
    questionType: {
        type: String,
        enum: ['multiple-choice', 'true-false', 'essay'],
        default: 'multiple-choice',
    },
    options: {
        type: Object,
        // مثال: { A: 'الخيار الأول', B: 'الخيار الثاني' }
    },
    correctAnswer: {
        type: String,
        required: [true, 'Correct answer is required']
    },
    marks: { 
        type: Number, 
        required: [true, 'Marks are required'], 
        default: 1 
    },
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: [true, 'Exam reference is required']
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true })



module.exports = mongoose.model('Question', questionSchema);