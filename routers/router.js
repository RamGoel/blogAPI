const express = require('express');
const router = express.Router();
const {addBlog, updateBlog, getBlogs} =require('../controllers/blogController')
const {createUser, loginUser, resetPassword} =require('../controllers/authController')
const {userModel} =require('../models/userModel')

router.post('/signup',createUser)
router.post('/login',loginUser)
router.patch('/reset-password',resetPassword)

router.use(async(req, res, next) => {
    const { email, password } = req.body;
    if(!email?.length || !password?.length){
        return res.status(400).json({message:"Email or Password can't be empty."})
    }
    const user = await userModel.find({email:email, password:password});
    if (!user.length) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
    next();
});

router.post('/blogs',addBlog)
router.get('/blogs',getBlogs)
router.patch('/blogs/:id',updateBlog)



module.exports=router


