
import { de } from "zod/locales";
import AsyncHandler from "../handler/AsyncHandler.js";
import CustomError from "../handler/Error.util.js";
import User from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";
import jwt from "jsonwebtoken";

const registerUser = AsyncHandler(async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

    const existUser = await User.findOne({ email });
    if (existUser) {
        return next(new CustomError(302, "User all ready exists"))
    }

    const user = await User.create({ firstName, lastName, email, password });
    if (!user) {
        return next(new CustomError(500, "Faild to register user"));
    }

    res.status(301).json({ "success": true, user })

});



const loginUser = AsyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    //fist check the user exist or not 
    const existUser = await User.findOne({ email });
    if (!existUser) {
        return next(new CustomError(401, "Invalid credentials"));
    }

    // compaire the passwords; making the utils and make a function to compare the password;
    const comparingPassword = await existUser.comparePassword(password);
    if (!comparingPassword) {
        return next(new CustomError(301, "invalid creadentials"));
    }

    // next to generate the access and refresh token 
    const accessToken = generateAccessToken(existUser);
    const refreshToken = generateRefreshToken(existUser);

    // make a field of refresh token and store it

    existUser.refreshToken = [{ token: refreshToken, createdAt: Date.now() }];
    ;
    await existUser.save({ validateBeforeSave: false })

    // next to set the acess token in cookies  middlware third party mw;

    const options = {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000

    }

    res.cookie('refreshToken', refreshToken, options).status(200).json({
        success: true,
        massage: `${existUser.firstName} ${existUser.lastName} logged in successfully`,
        data: existUser,
        accessToken
    })

});


// @controller
// refresh token

const refreshToken = AsyncHandler(async (req, res, next) => {
    //get the refresh token 
    const incommingToken = req.cookies.refreshToken;
    
    if (!incommingToken) {
        return next(new CustomError(401, "Unauthorized request"));
    }

    // decode the token
    const decoded = jwt.verify(incommingToken, process.env.JWT_REFRESH_SECRET);
    // in decode = {userId: xxx.xxxx.xxxx, iat, expire}
    if (!decoded) {
        return next(new CustomError(401, "tokein is invalid"));
    }

    // db call and check get the user 
    const isTokenExist =await  User.findOne({ "refreshToken.token": incommingToken })
    
    if (!isTokenExist) {
        return next(new CustomError(401, "invalid Token"));
    }

    // generate both new tokens and add in db and set to cookies.
    const newRefreshToken = generateRefreshToken(isTokenExist);
    const newAccessToken = generateAccessToken(isTokenExist);

    // now to db update DB

    isTokenExist.refreshToken = [{ token: newRefreshToken, createdAt: Date.now() }]
    await isTokenExist.save({ validateBeforeSave: false });


    // now to set the tokens in cookies 
    const options = {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000

    }

    res
        .cookie("refreshToken", newRefreshToken, options)
        .status(200)
        .json({
            success: true,
            massage: "token is refresh successfuly",
            data: {
                accessToken: newAccessToken
            }
        })


})

export { registerUser, loginUser, refreshToken }