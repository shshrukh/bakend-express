import  { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import validate from "../middleware/zodValidate.Middleware.js";
import registerUserScheama from "../schemas/registerUser.js";


// const router = Router();    

// router.get('/profile', (req, res) => {
//     res.json({
//         status: 'success',
//         message: 'User profile data'
//     });
// });


// export default router;

const userRouter = Router();



userRouter.route('/register').post(validate(registerUserScheama) ,registerUser);

export default userRouter