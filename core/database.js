const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://mean12072021:h18062011@cluster0.0gxmd.mongodb.net/mean20180818?retryWrites=true&w=majority', 
{useNewUrlParser: true, 
useUnifiedTopology: true,
useCreateIndex: true
})
.then(()=>{
    console.log('Ket noi data thanh cong!');
})
.catch((err) => {
    console.log(err);
});