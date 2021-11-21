const mongoose = require('mongoose');


const CategorySchema = new mongoose.Schema({
    name:{
        type: String,
        unique: true, // không được trùng
        required: true // bắt buộc nhập
    },
    slug:{
        type: String,
        unique: true, // không được trùng
        required: true // bắt buộc nhập
    },
    img: String,
    parents:String,
    product_id:mongoose.Schema.Types.ObjectId,
    content: String,
    status: {
        type: Boolean,
        default: true
    },
    trash:{
        type: Boolean,
        default: false
    },
    date_created: {
        type: Date,
        default: Date.now()
    } ,
    date_updated: {
        type: Date,
        default: Date.now()
    } 


});

// Model: tạo collection
module.exports = mongoose.model('category', CategorySchema);