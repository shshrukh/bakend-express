import AsyncHandler from "../handler/AsyncHandler.js";


const currenUser = AsyncHandler(async(req, res, next)=>{
    
    let user = req.user;
    console.log(user,"this is current user controller ");
    
    res.status(200).json({
        massage: true,
        data: user
    })

});

export {currenUser}