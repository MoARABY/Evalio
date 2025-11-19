const mongoose = require('mongoose');

const classLevelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Class level name is required'],
        unique: [true, 'Class level name must be unique']
    },
    description: { 
        type: String
    },
    program: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Program',
        required: true
    },
    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
    }],
    teachers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: [true, 'Created by is required'] 
    },
}, {timestamps: true})


module.exports = mongoose.model('ClassLevel', classLevelSchema);