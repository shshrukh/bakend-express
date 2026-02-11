import { Router } from "express";
import outhMiddlaware from "../middleware/outh.middleware.js";
import { allowRole } from "../middleware/allowRole.Middleware.js";
import { deleteUser } from "../controllers/admin.controller.js";


const adminRoute = Router();

// using route parameter
adminRoute.route('/delete/:userId').delete(outhMiddlaware, allowRole("admin"), deleteUser)


export {adminRoute}