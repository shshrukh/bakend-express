import AsyncHandler from "../handler/AsyncHandler.js";
import CustomError from "../handler/Error.util.js";
import User from "../models/user.model.js";


// @admin controller
// delete user


const deleteUser = AsyncHandler(async (req, res, next)=>{

    const userId = req.params.userId;

    const user =  await User.findByIdAndDelete(userId);
    if(!user){
        return next(new CustomError(404 , "user not found"))
    }
    

    res.status(200).json({
        success:true,
        message:"user deleted successfully"
    })
});


export {deleteUser}