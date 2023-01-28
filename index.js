const express = require('express');
const bodyParser = require('body-parser');
const url='mongodb+srv://ramgoel1:iXWFhxuFy7BCG0hD@cluster0.trnmzpg.mongodb.net/Hisaab?retryWrites=true&w=majority'
const mongoose=require('mongoose')

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const blogSchema= new mongoose.Schema({
    title:String,
    content:String,
})
const blogModel=mongoose.model('cf-blogs', blogSchema)

const userSchema= new mongoose.Schema({
    email:String,
    password:String,
})

exports.userModel=mongoose.model('cf-users', userSchema)

mongoose.connect(url,(err)=>{
    console.log("Error: ",err)
})


app.post('/signup', async(req, res) => {
    const { email, password } = req.body;
    const isUserExists=await userModel.find({email:email})
    if(!isUserExists.length){

        const newUser = new userModel({ email, password });
        
        await newUser.save().then(e=>{
            res.status(201).json({
                message: 'User created'
            });
        }).catch(err=>{
            res.status(400).json({
                message: 'Some Error Occured',
                err
            });
        })
    }else{
        res.status(500).json({
            message:"Email Already Exists"
        })
    }
    
});

app.post('/login',  async(req, res) => {
    const { email, password } = req.body;
    const user = await userModel.find({email :email});
    if (!user.length) {
        return res.status(404).json({
            message: 'No User Found'
        });
    }
    if (user[0].password!=password) {
        return res.status(401).json({
            message: 'Invalid Password'
        });
    }
    console.log(user)
    return res.status(200).json({
        message: 'Auth successful'
    });
});



app.patch('/reset-password', async(req, res) => {
    const { email, password } = req.body;
    if(!email?.length || !password?.length){
        return res.status(400).json({message:"Email or Password can't be empty."})
    }
    
    userModel.findOneAndUpdate({
        email:email
     },
     {
       $set: {
          email: req.body.email,           
          password: req.body.password
       }
     },{new:true},(err,credential)=>{
        if(!err && credential){
            res.status(200).json({
                message: 'User updated',
                credential
            });
        }else{
            res.status(404).json({
                message: 'User not found'
            });
        }
     })
});


app.use(async(req, res, next) => {
    const { email, password } = req.body;
    const user = await userModel.find({email:email, password:password});
    if (!user) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
    next();
});

app.get('/blogs', async(req, res) => {
    const page = req.query.page || 1;
    const startIndex = (page - 1) * 10;
    const endIndex = page * 10;
    const currentBlogs = await blogModel.find({})
    const allBlogs=currentBlogs.slice(startIndex, endIndex);
    res.status(200).json({
        blogs: allBlogs,
    });
});


app.post('/blogs', async(req, res) => {
    const { title, content } = req.body;
    const blog = new blogModel({ title, content });
    await blog.save().then(e=>{
        res.status(201).json({
            message: 'Blog created',
            id:e.id
        });
    }).catch(err=>{
        res.status(500).json({
            message: 'Some Error Occured',
            err
        });
    })
    
});

app.patch('/blogs/:id', async(req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    if(!title?.length || !content?.length){
        return res.status(400).json({message:"Title or Content can't be empty."})
    }
    if(!id?.length){
        return res.status(400).json({message:"Blog ID can't be empty"})
    }
    blogModel.findOneAndUpdate({
        _id: id
     },
     {
       $set: {
          title: req.body.title,           
          content: req.body.content
       }
     },{new:true},(err,post)=>{
        if(!err && post){
            res.status(200).json({
                message: 'Blog updated',
                post
            });
        }else{
            res.status(404).json({
                message: 'Blog not found'
            });
        }
     })
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
