const mongoose=require('mongoose')

const blogSchema= new mongoose.Schema({
    title:String,
    content:String,
})

exports.blogModel=mongoose.model('cf-blogs', blogSchema)