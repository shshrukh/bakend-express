import jwt from 'jsonwebtoken';
import CustomError from '../handler/Error.util.js';

const generateAccessToken = function(user){
    if(!user){
        throw new CustomError(402, "Empty user agrument");
    }

    const token = jwt.sign({userId: user?._id}, process.env.JWT_ACCESS_SECRET, {expiresIn: process.env.JWT_ACCESS_EXP} )
    return token 
}

const generateRefreshToken = function(user){
    if(!user){
        throw new CustomError(402, "Empty user agrument");
    }

    const token = jwt.sign({userId: user?._id}, process.env.JWT_REFRESH_SECRET, {expiresIn: process.env.JWT_REFRESH_EXP} )
    return token 
}


export {generateAccessToken, generateRefreshToken}
