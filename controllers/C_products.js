const {Router}  = require('express');
const express = require('express');
const router = express.Router();

//Goi admin
const admin = require('../core/admin');

//Goi model product
const M_products = require('../models/M_products');

router.get('/index(/:pageNumber)?',
(req,res,next) => {
    //Gọi cookie và kiểm tra đăng nhập
    if(req.cookies.name == undefined){

        //Chuyển về trang login 
        res.redirect('/admin/login');
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
    const sumData =  await M_products.find({trash: false});

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

    M_products
    .find({trash:false, name: { $regex: '.*' + value_search + '.*'} })
    .sort({_id:-1})
    .limit(limit)
    .skip(skip)
    .exec((err,data)=>{
        const view_main = kq.view_main(data, value_search,sumPage, pageNumber);

        res.render('index',{main,sidebar,view_main,name_module, js});
    })
})

router.get('/add',
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
    
    //Gọi sidebar
    const kq = new admin(req.originalUrl);

    //Js
    const js = 1;

    //category
    const array_category =[
        {name:'Illustrator',value:'Illustrator'},
        {name:'Photoshop',value:'Photoshop'},
        {name:'Tin tức',value:'Tin tức'}
    ]



    //obj form 
    const array_form = [
        {element: 'input',name: 'name', type: 'text', array:[], rows: 0, required: true, event: true},
        {element: 'input',name: 'slug', type: 'text', array:[], rows: 0, required: true, event: false},
        // {element: 'input',name: 'price', type: 'number', array:[], rows: 0, required:false, falseevent: false},
        {element: 'select',name: 'parents', type: '', array:array_category, rows: 0, required: false ,falseevent: false},
        {element: 'textarea',name: 'content', type: '', array:[], rows: 3, required: false ,falseevent: false}
    ]

    const sidebar = kq.view_sidebar();

    const view_main = kq.view_main(array_form);
    

    const main = kq.url_file();

    //name module

    const name_module = kq.get_url();

    res.render('index',{main,sidebar,view_main, name_module, js});

});

router.post('/formProcess',
(req,res,next) => {
    //Gọi cookie và kiểm tra đăng nhập
    if(req.cookies.name == undefined){

        //Chuyển về trang login 
        res.redirect('/admin/login');
    }else{ 
        next(); 
    }
},
(req, res) => {
    //Khai báo
    var name, slug, price, parents, content, flag =1;

    //Lấy dữ liệu
    name = req.body.name;
    slug = req.body.slug;
    price = req.body.price;
    parents = req.body.parents;
    content = req.body.content;
    

    //kiem tra du lieu

    if(name == ''){
        flag = 0;
        err = 'Ten khong duoc rong ';
    }
    if(slug == '' ){
        flag =0;
        err = 'Slug khong duoc rong';
    }

    //Tong hop
    if(flag == 1){
        //Kiểm tra db và lưu lại dữ liệu
        M_products
        .find({name})
        .exec((err,data) => {
            if(err){
                res.send({kq:0 , err});
            }else{
                //Kiem tra name
                if(data == ''){

                    M_products
                    .find({slug})
                    .exec((err,data) => {
                        if(err){
                            res.send({kq:0 , err});
                        }else{
                            //Kiểm tra slug
                            if(data == ''){
                                //Them du lieu
                                const obj ={name, slug, price, content, parents};
                                M_products
                                .create(obj, (err,data_insert)=>{
                                    if(err){
                                        res.send({kq:0 , err});
                                    }else{
                                        res.send({kq:1 , data : data_insert});
                                    }
                                })
                            }else{
                                res.send({kq:0 , err : 'Slug đã tồn tại', data});
                            }
                        }
                    })
                   
                }else{
                    res.send({kq:0 , err : 'Tên đã tồn tại', data});
                }
                
            }
        })
    }else{
        res.send(err);
    }

    
})


router.post('/delete',
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
    var id, flag = 1;
    id = req.body.id;
    
    if(id == ''){
        flag = 0;
        err = 'Id không phù hợp';
    }

    if(flag == 1){
        //gọi db
        M_products
        .find()
        .exec((err,data)=>{
            if(err){
                res.send({kq:0 , err});
            }else{
               if(data == ''){
                   res.send({kq:0 , err: 'Dữ liệu không tồn tại'});
               }else{
                   M_products
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

router.post('/status',
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
        M_products
        .find({_id: id})
        .exec((err,data)=>{
            if(err){
                res.send({kq:0 , err});
            }else{
               if(data == ''){
                   res.send({kq:0 , err: 'Dữ liệu không tồn tại'});
               }else{
                   M_products
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

module.exports = router;