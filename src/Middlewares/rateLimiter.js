const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many requests from this IP, please try again after 10 minutes'
})

module.exports = limiter