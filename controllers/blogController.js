const {blogModel} =require('../models/blogModel')

exports.getBlogs=async(req, res) => {
    const page = req.query.page || 1;
    const startIndex = (page - 1) * 10;
    const endIndex = page * 10;
    const currentBlogs = await blogModel.find({})
    const allBlogs=currentBlogs.slice(startIndex, endIndex);
    res.status(200).json({
        blogs: allBlogs,
    });
}


exports.addBlog=async(req, res) => {
    const { title, content } = req.body;
    if(!title?.length || !content?.length){
        return res.status(400).json({message:"Title or Content can't be empty."})
    }
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
    
}

exports.updateBlog=async(req, res) => {
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
}