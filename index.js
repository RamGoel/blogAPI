const express = require('express');
const bodyParser = require('body-parser');
const url='mongodb+srv://ramgoel1:iXWFhxuFy7BCG0hD@cluster0.trnmzpg.mongodb.net/Hisaab?retryWrites=true&w=majority'
const mongoose=require('mongoose');
const cfRouter = require('./routers/router');

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/', cfRouter)

mongoose.connect(url,(err)=>{
    console.log("Error: ",err)
})

app.listen(3001, () => {
    console.log('Server started on port 3001');
});
