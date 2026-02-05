function errorMiddleware(err, req, res, next) {
    const message = err.message;
    const statusCode = err.statusCode  ||500;
    res.status(statusCode).json({success:false, message})
}

export default errorMiddleware;