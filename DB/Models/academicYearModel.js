const mongoose = require('mongoose');


const AcademicYearSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Academic year name is required'],
        unique: [true, 'Academic year name must be unique']
    },
    startDate: { 
        type: Date, 
        required: [true, 'Start date is required'] 
    },
    endDate: { 
        type: Date, 
        required: [true, 'End date is required'] 
    },
    academicYearAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('AcademicYear', AcademicYearSchema);