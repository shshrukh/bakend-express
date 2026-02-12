import { Router } from "express";
import outhMiddlaware from "../middleware/outh.middleware.js";
import { changePassword, currenUser, forgetPassword, resetPassword } from "../controllers/user.controller.js";
import { changePasswordSchema } from "../schemas/changePassword.js";
import validate from "../middleware/zodValidate.Middleware.js";
import { resetPasswordSchema } from "../schemas/resetPassword.js";
import { resetNewPasswordSchema } from "../schemas/resetNewPassword.js";
import rateLimit from "express-rate-limit";
import { success } from "zod";


const userRouter = Router();

const forgetPasswordLimiter = rateLimit({
    windowMs: 5*60*1000,
    max: 5,
    message: {
        success: false,
        message: "Too many password reset attempts. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false

})

const changePasswordLimiter = rateLimit({
    windowMs: 10*60*1000,
    max: 2,
    message: {
        success: false,
        message: "Too many password change attempts. Please try again later"
    },
    standardHeaders: true,
    legacyHeaders:false
})



userRouter.route('/current-user').get(outhMiddlaware, currenUser);
userRouter.route('/change-password').post(changePasswordLimiter, validate(changePasswordSchema), outhMiddlaware, changePassword);
userRouter.route('/forget-password').post(forgetPasswordLimiter, validate(resetPasswordSchema), forgetPassword);
userRouter.route('/reset-password/:token').post(validate(resetNewPasswordSchema), resetPassword);



export default userRouter;