const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'name is require']
    },
    email: {
        type: String,
        required: [true, 'email is require']
    },
    phone: {
        type: Number,
        required: [true, 'email is require']
    },
    password: {
        type: String,
        required: [true, 'pssword is require']
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isDoctor: {
        type: Boolean,
        default: false
    },
    notification: {
        type: Array,
        default: []
    },
    seennotification: {
        type: Array,
        default: []
    },
     specilization: {
       type: String,
       default: 'chirurgien dentist'
    }
})

const userModel = mongoose.model('users', userSchema);
module.exports = userModel