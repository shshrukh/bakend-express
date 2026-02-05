import CustomError from "../handler/Error.util.js";
import AsyncHandler from "../handler/AsyncHandler.js";
import User from "../models/user.model.js";




const registerUser = AsyncHandler(async (req, res, next )=>{
    const {firstName, lastName, email, password} = req.body;

    const userExist = await User.findOne({email})
    if(userExist){
        return next(new CustomError (300, 'user allready exist'))
    }

    const user = await User.create({firstName, lastName, email, password})

    if(!user){
        return next(new CustomError(500, 'fail to register user'))
    }
    res.status(401).json({success: true, user})


})

export { registerUser};

