import CustomError from "../handler/Error.util.js"

function validate (schema){

return (req, res, next)=>{

    if(!req.body || Object.keys(req.body).length === 0){
        return next (new CustomError(301, 'body is empty in this case'))
    }

    const result  = schema.safeParse(req.body);
    // console.log("this is result obj", result);
    

    if(result.success){
        req.body = result.data;
        return next()
    }

    // Errors

    const errors = {};  
    // console.log(result);
    
    result.error.issues.forEach((issue)=>{
        
        
        errors[issue.path[0]] = issue.message
    })

    res.status(400).json({errors})

    
}


}

export default validate;