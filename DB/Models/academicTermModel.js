const mongoose = require('mongoose');

const academicTermSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Academic term name is required']
    },
    description: { 
        type: String,
        minlength: [10, 'Description must be at least 10 characters long']
    },
    startDate: { 
        type: Date, 
        required: [true, 'Start date is required']
    },
    endDate: { 
        type: Date, 
        required: [true, 'End date is required']
    },
    academicYear: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AcademicYear',
        required: [true, 'Academic year is required'],
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Admin', 
        required: [true, 'Creator is required'] 
    }
}, { timestamps: true })


module.exports = mongoose.model('AcademicTerm', academicTermSchema)