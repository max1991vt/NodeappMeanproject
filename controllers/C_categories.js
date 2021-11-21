const express = require('express');
const router = express.Router();
const admin = require('../core/admin');
router.get('/index', (req, res)=>{
    
    //Gọi sidebar
    const kq = new admin(req.originalUrl);

    //Js
    const js = 0;
    const mongoose = require('mongoose');


    const UserSchema = new mongoose.Schema({
        name: String,
        userName:{
            type: String,
            unique: true, // không được trùng
            required: true // bắt buộc nhập
        },
        password:{
            type: String,
            required: true // bắt buộc nhập
        },
        img: String,
        role: String,
        email:{
            type: String,
            unique: true, // không được trùng
            required: true // bắt buộc nhập
        },
        
        phone: {
            type : String, //  để dạng number thì bị bỏ số 0 đằng trước
            unique: true, 
        },
        
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
    module.exports = mongoose.model('product', UserSchema);
    const sidebar = kq.view_sidebar();

    const view_main = kq.view_main();
    

    const main = kq.url_file();

    const name_module = kq.get_url();

    res.render('index',{main,sidebar,view_main, name_module,js});

})
router.get('/list',(req, res)=>{
    res.send({msg: 'hello angular app'});
})
module.exports = router;