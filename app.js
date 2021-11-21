const express = require('express');
const app = express();

//Cấu hình nhận APi
app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:57880');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

//Cài đặt đường dẫn tĩnh
app.use(express.static('public'));

//body-parser
var bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//Gọi cookie-parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());

//Gọi ejs
app.set('view engine', 'ejs');

//Gọi db
require('./core/database');

//Gọi controller
app.use('/',require('./controllers/controls'));


app.get('/', (req, res) => {
    res.send('hello');
})


app.listen(4000,()=>{
    console.log('listening on port 4000');
});