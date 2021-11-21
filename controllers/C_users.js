const express = require('express');
const router = express.Router();

//Gọi Bcryptjs -- Bcrypt up heroku bị lỗi
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

//Goi admin
const admin = require('../core/admin');

//Goi model product
const M_users = require('../models/M_users');

router.get('/user/index(/:pageNumber)?',
(req,res,next) => {
    //Gọi cookie và kiểm tra đăng nhập
    if(req.cookies.name == undefined){

        //Chuyển về trang login 
        res.redirect('/admin/login');
    }else{ 
        next(); 
    }
},
//Kiểm tra vai trò
(req,res,next) => {
    //Gọi cookie và kiểm tra đăng nhập
    if(req.cookies.name.role != 'admin'){
        res.send({kq:0, err:'Bạn không đủ quyền vào trang này!'});
        //Chuyển về trang login 
        // res.redirect('/admin/login');
    }else{ 
        next(); 
    }
},
async(req, res)=>{
    var url = decodeURIComponent(req.originalUrl);
    var value_search = '';
  
    //Xét  tìm kiếm
    if(url.indexOf('?') != -1){
        var str = url.split('?'); //[index, search=abc]
        if(str[1] != ''){
            url = str[0];
            value_search = str[1].split('=')[1].replace(/\+/g, ' ');
        }
    }

    //Phân trang
    
    const limit = 2;
    let skip ;
    const pageNumber = req.params.pageNumber;

    if( pageNumber === undefined || pageNumber == 1){
        //Trang 1 và trang 0 ( trang đầu )
        skip = 0;
    }else{
        //Trang 2,3,4,5,6  , limit = 2 
        //Trang 2 skip =2
        //Trang 3 skip = 4
        //Trang 4 skip = 6

        skip =  (pageNumber -1 ) * limit;
    }

    //View hiển thị ra bên ngoài

    //Tổng số dữ liệu
    const sumData =  await M_users.find({trash: false});

    //Tổng số trang
    const sumPage = Math.ceil(sumData.length / limit);

    //-----end view hiển thị phân trang 


    //End phân trang
    
    //Gọi sidebar
    const kq = new admin(req.originalUrl);

    //Js
    const js = 0;

    const sidebar = kq.view_sidebar();
 
    
    

    const main = kq.url_file();

    const name_module = kq.get_url();

    M_users
    .find({ name: { $regex: '.*' + value_search + '.*'} })
    .sort({_id:-1})
    .limit(limit)
    .skip(skip)
    .exec((err,data)=>{
        //View main
        const view_main = kq.view_main(data, value_search,sumPage, pageNumber);

        res.render('index',{main,sidebar,view_main,name_module, js});
    })
})

router.get('/user/add',
(req,res,next) => {
    //Gọi cookie và kiểm tra đăng nhập
    if(req.cookies.name == undefined){

        //Chuyển về trang login 
        res.redirect('/admin/login');
    }else{ 
        next(); 
    }
},
//Kiểm tra vai trò
(req,res,next) => {
    //Gọi cookie và kiểm tra đăng nhập
    if(req.cookies.name.role != 'admin'){
        res.send({kq:0, err:'Bạn không đủ quyền vào trang này!'});
        //Chuyển về trang login 
        // res.redirect('/admin/login');
    }else{ 
        next(); 
    }
},
(req, res)=>{
    
    //Gọi sidebar
    const kq = new admin(req.originalUrl);

    //Js
    const js = 1;

    //category
    const array_category =[
        {name:'a',value:1},
        {name:'b',value:1}
    ]

    //role
    const role = [
        {name:'Admin', value:'admin'},
        {name:'User', value:'user'},
        {name:'Guest', value:'guest'}
    ];

    //obj form 
    const array_form = [
        {element: 'input',name: 'username', type: 'text', array:[], rows: 0, required: true, event: false},
        {element: 'input',name: 'password', type: 'text', array:[], rows: 0, required: true, event: false},
        {element: 'select',name: 'role', type: '', array: role , rows: 0, required:  true ,event: false},
        {element: 'textarea',name: 'name', type: '', array:[], rows: 0, required: false , event: false},
        {element: 'textarea',name: 'email', type: '', array:[], rows: 3, required: false , event: false},
        {element: 'textarea',name: 'phone', type: '', array:[], rows: 3, required: false , event: false}
    ]

    const sidebar = kq.view_sidebar();

    const view_main = kq.view_main(array_form);
    

    const main = kq.url_file();

    //name module

    const name_module = kq.get_url();

    res.render('index',{main,sidebar,view_main, name_module, js});

});

router.post('/user/formProcess',
(req,res,next) => {
    //Gọi cookie và kiểm tra đăng nhập
    if(req.cookies.name == undefined){

        //Chuyển về trang login 
        res.redirect('/admin/login');
    }else{ 
        next(); 
    }
},
//Kiểm tra vai trò
(req,res,next) => {
    //Gọi cookie và kiểm tra đăng nhập
    if(req.cookies.name.role != 'admin'){
        res.send({kq:0, err:'Bạn không đủ quyền vào trang này!'});
        //Chuyển về trang login 
        // res.redirect('/admin/login');
    }else{ 
        next(); 
    }
},
(req, res) => {
    //Khai báo
    var name, username, password, role, email, phone, flag =1;

    //Lấy dữ liệu
    name = req.body.name;
    username = req.body.username;
    password = req.body.password;
    role = req.body.role;
    email = req.body.email;
    phone = req.body.phone;
    console.log(name, username, password, role, email, phone);

    //kiem tra du lieu

    if(username == ''){
        flag = 0;
        err = 'Tên đăng nhập không được rỗng ';
    }
    if(password == '' ){
        flag =0;
        err = 'Mật khẩu không được rỗng';
    }

    //Tong hop
    if(flag == 1){
    //     const obj = {name, username, password, role, email, phone};
    //     console.log(obj);
        //Kiểm tra db và lưu lại dữ liệu
        M_users
        .find({username})
        .exec((err,data) => {
            if(err){
                res.send({kq:0 , err});
            }else{
                //Kiem tra tên đăng nhập
                if(data == ''){

                    var hash = bcrypt.hashSync(password, salt);
                    // Them du lieu
                     const obj ={name,username,password: hash, role, email, phone};
                     console.log(obj);
                     M_users
                     .create(obj, (err,data_insert)=>{
                         if(err){
                             res.send({kq:0 , err});
                         }else{
                             res.send({kq:1 , data : data_insert});
                         }
                     })
                   
                }else{
                    res.send({kq:0 , err : 'Tên đăng nhập đã tồn tại', data});
                }
                
            }
        })
       
    }else{
        res.send(err);
    }

    
})


router.post('/user/delete', 
(req,res,next) => {
    //Gọi cookie và kiểm tra đăng nhập
    if(req.cookies.name == undefined){

        //Chuyển về trang login 
        res.redirect('/admin/login');
    }else{ 
        next(); 
    }
},
//Kiểm tra vai trò
(req,res,next) => {
    //Gọi cookie và kiểm tra đăng nhập
    if(req.cookies.name.role != 'admin'){
        res.send({kq:0, err:'Bạn không đủ quyền vào trang này!'});
        //Chuyển về trang login 
        // res.redirect('/admin/login');
    }else{ 
        next(); 
    }
},
(req, res)=>{
    var id, flag = 1;
    id = req.body.id;
    
    if(id == ''){
        flag = 0;
        err = 'Id không phù hợp';
    }

    if(flag == 1){
        //gọi db
        M_users
        .find()
        .exec((err,data)=>{
            if(err){
                res.send({kq:0 , err});
            }else{
               if(data == ''){
                   res.send({kq:0 , err: 'Dữ liệu không tồn tại'});
               }else{
                M_users
                   .updateMany({_id: id}, {trash: true}, (err,data)=>{
                       if(err){
                           res.send({kq:0 , err});
                       }else{
                           res.send({kq:1 , msg: 'Cập nhật thành công'});
                       }
                   }) 
                }
            }
            
        });
    }else
    {
        res.send({kq:0 , err});
    }
})

router.post('/user/status',
(req,res,next) => {
    //Gọi cookie và kiểm tra đăng nhập
    if(req.cookies.name == undefined){

        //Chuyển về trang login 
        res.redirect('/admin/login');
    }else{ 
        next(); 
    }
},
//Kiểm tra vai trò
(req,res,next) => {
    //Gọi cookie và kiểm tra đăng nhập
    if(req.cookies.name.role != 'admin'){
        res.send({kq:0, err:'Bạn không đủ quyền vào trang này!'});
        //Chuyển về trang login 
        // res.redirect('/admin/login');
    }else{ 
        next(); 
    }
},
(req, res)=>{
    var status, id, flag = 1, err ='';

    status = req.body.status;
    id = req.body.id;

    if(id == '')
    {
        flag = 0;
        err = 'Dữ liệu không tồn tại';
    }

    //Tổng hợp
    if(flag == 1){
        //Gọi db
        M_users
        .find({_id: id})
        .exec((err,data)=>{
            if(err){
                res.send({kq:0 , err});
            }else{
               if(data == ''){
                   res.send({kq:0 , err: 'Dữ liệu không tồn tại'});
               }else{
                M_users
                   .updateMany({_id: id}, {status}, (err,data)=>{
                       if(err){
                           res.send({kq:0 , err});
                       }else{
                           res.send({kq:1 , msg: 'Cập nhật thành công'});
                       }
                   }) 
                }
            }
            
        });
    }else{
        res.send({kq:0 , err});
    }

})

router.get('/login',(req, res)=>{

    res.render('login');
})

router.post('/user/handleLogin',(req, res)=>{
    //Khai báo
    var username, password, err, flag = 1;
    //Lấy dữ liệu
    username = req.body.username;
    password = req.body.password;

    //Kiểm tra dữ liệu
    if(username ==''){
        flag = 0;
        err ='Tên đăng nhập không được rỗng';
    }
    if(password == ''){
        flag = 0;
        err ='Mật khẩu không được rỗng';
    }
    //Tổng kết
    if(flag == 1){
        //Gọi db
        M_users
        .find({username})
        .exec((err,data)=>{
            if(err){
                res.send({kq:0 , err});
            }else{
                console.log(data);
                //Kiểm tra username
               if(data== ''){
                    res.send({kq:0 , err:'Tên đăng nhập không tồn tại'})
                }else{
                    //Kiểm tra password
                   const result = bcrypt.compareSync(password, data[0].password);
                   if(result== false){
                       res.send({kq:0 , err:'Mật khẩu không chính xác'});
                   }else{
                       //Login thành công

                       var login_value ={username, role: data[0].role};
                       
                        //Tạo 1 biến cookie kiểm tra đăng nhập
                        res.cookie('name', login_value, {maxAge:600000})
                        .send({kq:1,msg:'Login thành công'});
                   }
                   
                }
            }
        })
    }else{
        res.send({kq:0 , err});
    }
})
module.exports = router;