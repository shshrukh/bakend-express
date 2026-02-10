import { Router } from "express";
import outhMiddlaware from "../middleware/outh.middleware.js";
import { currenUser } from "../controllers/user.controller.js";


const userRouter = Router();



userRouter.route('/current-user').get(outhMiddlaware, currenUser)



export default userRouter;