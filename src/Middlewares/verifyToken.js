const JWT = require('jsonwebtoken')
const userModel = require('../../DB/Models/userModel');


const verifyToken = async (req, res, next) => {


    // catch token from cookies or Authorization header
    let token
    if(req.cookies.authorization) token = req.cookies.authorization
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({ status: 'fail', msg: 'Access denied. No token provided.' });
    }


    try {
        // Verify token
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        // Check if user still exists
        const user = await userModel.findById(decoded.id)
        if(!user) return res.status(401).json({status:'fail',msg:'the user belonging to this token no longer exist'})

        // check if user changed his password after the token was issued
        console.log(user.passwordChangedAt);
        if(user.passwordChangedAt && decoded.iat < +(user.passwordChangedAt.getTime()/1000)){
            return res.status(401).json({status:'fail',msg:'User recently changed password, please login again'})
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ status: 'fail', msg: 'Token expired.' });
        }
        return res.status(401).json({ status: 'fail', msg: 'Invalid token.' });
    }
}


const allowedTo = (...roles)=>{
    return (req,res,next)=>{

        // nested verify token middleware
        verifyToken(req,res,()=>{
            if(!roles.includes(req.user.role)){
                return res.status(403).json({status:'fail',msg:'you are not authorized!'})
            }
            next()
        })
    }
}

module.exports = {verifyToken,allowedTo};