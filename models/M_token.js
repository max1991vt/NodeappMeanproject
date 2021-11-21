const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        unique: true, // không được trùng
        required: true // bắt buộc nhập
    },
    token: String,
    status: {
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model('token', TokenSchema);