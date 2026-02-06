import AsyncHandler from "../handler/AsyncHandler.js";
import CustomError from "../handler/Error.util.js";
import User from "../models/user.model.js";

const registerUser = AsyncHandler(async (req, res , next)=>{
    const {firstName, lastName, email, password}=req.body;

    const existUser = await User.findOne({email});
    if(existUser){
        return next(new CustomError(302, "User all ready exists"))
    }

    const user = await User.create({firstName, lastName, email, password});
    if(!user){
        return next(new CustomError(500, "Faild to register user"));
    }
    
    res.status(301).json({"success": true, user})
    
});



const loginUser = AsyncHandler(async (req, res, next)=>{
    const {email, password} = req.body;

    //fist check the user exist or not 
    const existUser = await User.findOne({email});
    if(!existUser){
        return next(new CustomError(301, "invalid cridentials"));
    }

    // compaire the passwords; making the utils and make a function to compare the password;
    const comparingPassword = existUser.comparePassword(password);
    if(!comparingPassword){
        return next(new CustomError(301, "invalid creadentials"));
    }
    res.status(403).json({"massage": "login successfully"})

});

export {registerUser, loginUser}