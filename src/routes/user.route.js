import { Router } from "express";
import outhMiddlaware from "../middleware/outh.middleware.js";
import { changePassword, currenUser, forgetPassword } from "../controllers/user.controller.js";
import { changePasswordSchema } from "../schemas/changePassword.js";
import validate from "../middleware/zodValidate.Middleware.js";


const userRouter = Router();



userRouter.route('/current-user').get(outhMiddlaware, currenUser);
userRouter.route('/change-password').post(validate(changePasswordSchema), outhMiddlaware, changePassword);
userRouter.route('/forget-password').post(forgetPassword)



export default userRouter;