const express = require('express');
const router = express.Router();

//dashboard
router.use('/admin/dashboard', require('./dashboards'));

//production
router.use('/admin/product', require('./C_products'));

//category
router.use('/admin/category', require('./C_categories'));

//user
router.use('/admin', require('./C_users'));

//Api category
router.use('/api/category', require('./Api/Api_categories'));

//Api product
router.use('/api/product', require('./Api/Api_products'));

//Api user
router.use('/api/user', require('./Api/Api_users'));

//Api login
router.use('/api/login', require('./Api/Api_login'));





module.exports = router;