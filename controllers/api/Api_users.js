const express = require('express');
const router = express.Router();

//Gọi Bcryptjs -- Bcrypt up heroku bị lỗi
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

//Goi admin
const admin = require('../../core/admin');

//Goi model product
const M_users = require('../../models/M_users');
const { response } = require('express');

router.post('/add',(req, res) => {
    // res.send({kq:'hello angular'})
   
    //Khai báo
    var name, username, password, role, email, phone, flag =1;

    //Lấy dữ liệu
    name = req.body.name;
    username = req.body.username;
    password = req.body.password;
    role = req.body.role;
    email = req.body.email;
    phone = req.body.phone;

    // res.send({data: {name, username, password, email, phone}});
    let newdata = {data: {name, username, password, email, phone}};
    let data = newdata.data;

    name = data.name;
    username = data.username;
    password = data.password;
    role = data.role;
    email = data.email;
    phone = data.phone;

    // console.log(name);


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
        console.log(data);
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

module.exports = router;