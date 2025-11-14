const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
    },  
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email must be unique'],
    },  
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    phone : {
        type: String,
        required: [true, 'Phone number is required'],
        unique: [true, 'Phone number must be unique'],
    },
    role: {
        type: String,
        enum: ['Staff', 'Teacher', 'Admin', 'Student'],
        default: 'Student'
    },
    isActive : {
        type:String,
        default:true
    }
}, { timestamps: true })


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    // Hashing user password
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

module.exports = mongoose.model('User', userSchema) 