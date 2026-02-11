import { Router } from "express";
import validate from "../middleware/zodValidate.Middleware.js";
import { registerUser, loginUser, refreshToken } from "../controllers/outh.controller.js";
import registerUserScheama from "../schemas/registerUser.js";
import loginUserSchema from "../schemas/loginUser.js";


const outhRoute = Router()


outhRoute.route('/register').post(validate(registerUserScheama), registerUser);
outhRoute.route('/login').post(validate( loginUserSchema), loginUser );
outhRoute.route('/refresh-token').post(refreshToken);


export default outhRoute