const {userModel} =require('../models/userModel')

exports.createUser=async(req, res) => {
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
    
}

exports.loginUser=async(req, res) => {
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
}


exports.resetPassword=async(req, res) => {
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
}