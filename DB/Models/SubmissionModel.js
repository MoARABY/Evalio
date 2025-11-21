const mongoose = require('mongoose')

const submissionSchema = new mongoose.Schema({
    examAttempt: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExamA',
        required: [true, 'Exam Attempt is required'],
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Student is required'],
    },
    startedAt: { type: Date, required: [true, 'Started At is required'] },
    submittedAt: { type: Date },
    answers: [{
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question',
            required: [true, 'Question is required'],
        },
        selectedOption: { type: String, required: [true, 'Selected Option is required'] },
        isCorrect: { type: Boolean }
    }],
    totalScore: { type: Number, default: 0 },
    correctAnswers :{ type: Number, default: 0 },
    wrongAnswers :{ type: Number, default: 0 },
    questionsCount :{ type: Number, default: 0 },
    grade :{ type: String, default: '' },
    percentage :{ type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('Submission', submissionSchema);