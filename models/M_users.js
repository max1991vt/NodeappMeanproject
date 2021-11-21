const mongoose = require('mongoose');

const User1Schema = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        unique: true, // không được trùng
        required: true // bắt buộc nhập
    },
    password: {
        type: String,
        required: true // bắt buộc nhập
    },
    img: String,
    role: String,
    email: {
        type: String,
        unique: true, // không được trùng
    },
    phone: {
        type: String,
        unique: true, // không được trùng
    }, // 0383333666
    status: {
        type: Boolean,
        default: false
    },
    trash: {
        type: Boolean,
        default: false
    },
    date_created: {
        type: Date,
        default: Date.now()
    },
    date_updated: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('user1', User1Schema);