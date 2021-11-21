const express = require('express');
const router = express.Router();


//Gọi modal category
const M_category = require('../../models/M_categories');

//Gọi admin
const admin = require('../../core/admin');


//Thêm dữ liệu
router.post('/add',(req, res) => {
    
    //Gọi class ra sử dụng
    const kq = new admin(req.originalUrl);
    //Khai báo dữ liệu
    var name, slug,parents, flag =1, err='';
    //Lấy dữ liệu
    name = req.body.name;
    //Slug lấy từ name truyền vào
    //Điện thoại di động => slug: dien-thoai-di-dong
    slug = kq.ChangeToSlug(name);
    parents = req.body.parents;
    //Kiểm tra dữ liệu
    if(name == ''){
        flag =0;
        err = 'Tên không được rỗng';
    }
    //Tổng hợp
    if(flag == 1){
        //Gọi db
        M_category
        .find({name})
        .exec((err, data)=>{
            if(err){
                res.send({kq:0, err}) 
            }else{
                
                
                //Xét name có tồn tại không
                if(data == ''){
                    //Thêm dữ liệu
                    const obj={name, slug, parents};
                    M_category
                    .create(obj,(err,data)=>{
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
    }else{
        res.send({kq:0, err});
    }
});

router.get('/list', (req, res)=>{

    //Gọi class ra sử dụng
     const kq = new admin(req.originalUrl);
    
    M_category
    .find({trash: false})
    .exec((err, data)=>{
        if(err){
            res.send({kq:0, err});
        }else{
            res.send({kq:1, data: kq.dequy(data)});
        }
    })
})

router.get('/slug/:name', (req, res)=>{
    
        //Gọi class ra sử dụng
        const kq = new admin(req.originalUrl);
        
        M_category
        .find({slug: req.params.name})
        .exec((err, data)=>{
            if(err){
                res.send({kq:0, err});
            }else{
                res.send({kq:1, data: data[0].name});
            }
        })
    
    })
    
module.exports = router;