const express = require('express');
const router = express.Router();

//Gọi admin
const admin = require('../core/admin');

router.get('/index',
(req,res,next) => {
    //Gọi cookie và kiểm tra đăng nhập
    if(req.cookies.name == undefined){

        //Chuyển về trang login 
        res.redirect('/admin/login');
    }else{ 
        next(); 
    }
},
(req, res)=>{
        //Chuyển về trang quản lý

      //Sử dụng  
    const kq = new admin(req.originalUrl);

    //Js
    const js = 0;
    //Gọi sidebar
    const sidebar = kq.view_sidebar();

    const view_main = kq.view_main();
    

    const main = kq.url_file();

    const name_module = kq.get_url();

    res.render('index',{main,sidebar,view_main, name_module, js});
    
})
module.exports = router;