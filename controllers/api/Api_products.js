const express = require('express');
const router = express.Router();


//Gọi modal products
const M_products = require('../../models/M_products');

//Gọi admin
const admin = require('../../core/admin');


//Thêm dữ liệu
router.post('/add',(req, res) => {
    
    //Gọi class ra sử dụng
    const kq = new admin(req.originalUrl);
    //Khai báo dữ liệu
    var name, slug, content, parents, flag =1, err='';
    //Lấy dữ liệu
    name = req.body.name;
    //Slug lấy từ name truyền vào
    //Điện thoại di động => slug: dien-thoai-di-dong
    slug = kq.ChangeToSlug(name);
    // price = req.body.price;
    parents = req.body.parents;
    content = req.body.content;
    //Kiểm tra dữ liệu
    if(name == ''){
        flag =0;
        err = 'Tên không được rỗng';
    }
    //Tổng hợp
    if(flag == 1){
        //Gọi db
        M_products
        .find({name})
        .exec((err, data)=>{
            if(err){
                res.send({kq:0, err}) 
            }else{
                
                //Xét name có tồn tại không
                if(data == ''){
                    //Thêm dữ liệu
                    const obj={name, slug, parents, content};
                    M_products.create(obj,(err,data)=>{
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

router.get('/parent/:name', (req, res)=>{
    
    //Gọi class ra sử dụng
    const kq = new admin(req.originalUrl);
    
    M_products
    .find({parents: req.params.name})
    .exec((err, data)=>{
        if(err){
            res.send({kq:0, err});
        }else{
            res.send({kq:1, data});
        }
    })
})


router.get('/:name', (req, res)=>{
    
    //Gọi class ra sử dụng
    const kq = new admin(req.originalUrl);
    
    M_products
    .find({slug: req.params.name})
    .exec((err, data)=>{
        if(err){
            res.send({kq:0, err});
        }else{

            res.send({kq:1, data});
        }
    })
})


module.exports = router;