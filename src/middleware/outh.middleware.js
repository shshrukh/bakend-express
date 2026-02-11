import AsyncHandler from "../handler/AsyncHandler.js";
import CustomError from "../handler/Error.util.js";
import jwt from "jsonwebtoken"
import User from "../models/user.model.js";


const outhMiddlaware = AsyncHandler(async (req, res, next) => {
    //chekig the token 
    // console.log("workig");
    

    const token = req.cookies?.accessToken || req.headers?.authorization?.split(' ')[1];
    // console.log(token);

    if (!token) {
        return next(new CustomError(402, 'invalid access token'));
    }

    // decode the token 

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        // console.log('Decoded:', decoded);
    } catch (err) {
        console.log('JWT error:', err.name, err.message);
        return next(new CustomError(401, 'Invalid or expired token'));
    }
    // checking whether the payload have same information?
    const userID = decoded?.userId;


    // console.log(userID)
    if (!userID) {
        return next(new CustomError(401, "Invalid access token"))
    }

    // db call and get the user

    const user = await User.findById(userID).select('-password -refreshToken');
    // console.log("DB USERRRRRR" , user)
    if (!user) {
        return next(new CustomError(404, "user not found"));
    }
    // console.log(user);

    req.user = user;
    req.role = user.userRole;
    next();

});

export default outhMiddlaware;