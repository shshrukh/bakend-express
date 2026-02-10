
import AsyncHandler from "../handler/AsyncHandler.js";
import CustomError from "../handler/Error.util.js";
import User from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";

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
    const comparingPassword =await  existUser.comparePassword(password);
    if (!comparingPassword) {
        return next(new CustomError(301, "invalid creadentials"));
    }

    // next to generate the access and refresh token 
    const accessToken = generateAccessToken(existUser);
    const refreshToken = generateRefreshToken(existUser);

    // make a field of refresh token and store it

    existUser.refreshToken = [{ token: refreshToken, createdAt: Date.now() }];
;
    await existUser.save({validateBeforeSave:false})

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

export { registerUser, loginUser }