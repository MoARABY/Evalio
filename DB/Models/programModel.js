const mongoose = require('mongoose')

const programSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Program name is required'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        minlength: [10, 'Description should be at least 10 characters long']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Program', programSchema)