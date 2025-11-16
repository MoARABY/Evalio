const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Class level name is required'],
        unique: [true, 'Class level name must be unique'],
    },
    code: { 
        type: String,
        required: [true, 'Subject code is required'],
        unique: [true, 'Subject code must be unique'],
    },
    description: { 
        type: String
    },
    academicTerm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AcademicTerm',
        required: [true, 'Academic term is required']
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: [true, 'Creator admin is required']
    }
}, { timestamps: true });


module.exports = mongoose.model('Subject', subjectSchema);