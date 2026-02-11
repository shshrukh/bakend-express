
import CustomError from "../handler/Error.util.js";

function allowRole(...roles){
    return(req,res, next)=>{
        const role = req.role;
        // console.log(role);
        
        if(!roles.includes(role)){
            return next(new CustomError(403 , "you are not authorized to access this route"));
        }
        next();
    }
}

export {allowRole}