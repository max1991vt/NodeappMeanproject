const express = require('express');
const router = express.Router();

//Gọi Bcryptjs -- Bcrypt up heroku bị lỗi
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

//Goi admin
const admin = require('../../core/admin');

//Goi model product
const M_users = require('../../models/M_users');

//Goi model token
const M_token = require('../../models/M_token');

var jwt = require('jsonwebtoken');

router.post('/',(req, res)=>{
    
    //Khai báo
    var username, password, err, flag = 1;
    //Lấy dữ liệu
    username = req.body.username;
    password = req.body.password;

    let newdata = {data: {username, password}};
    let data = newdata.data;

    
    username = data.username;
    password = data.password;

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
                //console.log(data);
                //Kiểm tra username
               if(data== ''){
                    res.send({kq:0 , err:'Tên đăng nhập không tồn tại'})
                }else{
                    //Kiểm tra password
                   const result = bcrypt.compareSync(password, data[0].password);

                   if(result== false){
                       res.send({kq:0 , err:'Mật khẩu không chính xác'});
                   }else{
                        jwt.sign({name:data[0].name, username:data[0].username, role:data[0].role}, 'secret', { expiresIn: 20 * 60 }, (err,token) => {
                              if(err){
                                  res.send({kq:0 , err});
                              }else{
                                // luu token và username (hoặc id user) vào database tên là: token
                                //Gọi db token
                                M_token
                                .find({username})
                                .exec((err, data)=>{
                                    if(err){
                                        res.send({kq:0, err}) 
                                    }else{
                                        
                                        //Xét name có tồn tại không
                                        if(data == ''){
                                            //Thêm dữ liệu
                                            const obj={username, token, password};
                                            M_token.create(obj,(err,data)=>{
                                                if(err){
                                                    res.send({kq:0, err})
                                                }else{
                                                    res.send({kq:1, data})
                                                }
                                            })
                                        }else{
                                            res.send({kq:0, err:'Dữ liệu đã tồn tại'});
                                        }
                                    }
                                })
                              }
                        });
                   }
                   
                }
            }
        })
    }else{
        res.send({kq:0 , err});
    }
    
})


router.post('/deletetoken/:token',(req, res)=>{
    //Gọi class ra sử dụng
    const kq = new admin(req.originalUrl);
     token = req.params.token;

        M_token
        .find({token})
        // .findByIdAndDelete(token,(err,data)=>{
            .findOneAndRemove({token:token},(err,data)=>{
            if(err){
                res.send({kq:0, err})
            }else{
                res.send({kq:1, data})
            }
        })
    
})

router.post('/getinfouser/:token',(req, res)=>{
    //Gọi class ra sử dụng
    const kq = new admin(req.originalUrl);
     token = req.params.token;
    var decodedToken = jwt.decode(token);
    res.send(decodedToken);
    
    
})


module.exports = router;