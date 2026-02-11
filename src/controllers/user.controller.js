import AsyncHandler from "../handler/AsyncHandler.js";
import CustomError from "../handler/Error.util.js";
import User from "../models/user.model.js";
import crypto from "crypto"
import { sendEmail } from "../utils/sendEmail.js";
import { resetPasswordEmailTemplate } from "../emailTemplets/resetPassword.templet.js";


const currenUser = AsyncHandler(async(req, res, next)=>{
    
    let user = req.user;
    console.log(user,"this is current user controller ");
    
    res.status(200).json({
        massage: true,
        data: user
    })

});


//@ controller
// change Password
const changePassword = AsyncHandler(async(req, res, next)=>{
    const {oldPassword, newPassword} = req.body;
    console.log(oldPassword, newPassword);
    
    const user = req.user;
    if(oldPassword === newPassword){
        return next(new CustomError(403, "new password should be different from old passwrod"));
    }


    // checking wether the old password is correct? 

    const isPasswordCorrect = await user.comparePassword(oldPassword);

    if(!isPasswordCorrect){
        return next(new CustomError(401, "old password is incorrect")); 
    }

    user.password = newPassword;
    await user.save();
    res.status(201).json({
        success: true,
        massage: "password is updated successfuly"
    })
    

    

});

//@ controller
// forget Password
const forgetPassword = AsyncHandler(async(req, res, next)=>{
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user){
        return next(new CustomError(403, "user not exist with email"));
    }

    const newForgetPasswordToken = crypto.randomBytes(30).toString('hex');
    const tokenExpireTime = Date.now() + (10*60*60*1000);

    user.forgetPasswordToken = newForgetPasswordToken;
    user.forgetPasswordTokenExpire = tokenExpireTime;
    await user.save();
    
    // snd the email
    const userFullName = user.firstName+" "+ user.lastName;
    const forgetPasswordTEmplet = resetPasswordEmailTemplate(userFullName, newForgetPasswordToken)
    await sendEmail(user.email, "reset password", forgetPasswordTEmplet);
    res.status(200).json({
      success: true,
      message: "Reset password link send to your gmail, please check your email and reset your password "
   })
});

export {currenUser, changePassword, forgetPassword}