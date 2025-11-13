
const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        developmentError(err,res);
    } else if (process.env.NODE_ENV === 'production') {
        productionError(err,res);
    }
}

const productionError = (err,res)=>{
        res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
}

const developmentError = (err,res)=>{
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        trace:err.trace
    });
}

module.exports = errorMiddleware;   