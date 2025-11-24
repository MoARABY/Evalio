const express  = require('express')
const app = express()
require('dotenv').config()
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const helmet =  require('helmet')
const hpp = require('hpp')
const mongoSanitize = require('express-mongo-sanitize')
const {xss} = require('express-xss-sanitizer')


// set request body size limit and parse data
app.use(express.json({limit:'20kb'}))
app.use(express.urlencoded({ extended: true }))

// set security HTTP headers
app.use(helmet())

// enable CORS
app.use(cors())

// parse cookies
app.use(cookieParser())

// logging middleware
app.use(morgan('dev'))

// protect against xss attacks
app.use(xss())

// protect against nosql query injection
// app.use(mongoSanitize())

// protect against HTTP Parameter Pollution attacks
app.use(hpp())

// calling system routes
const dbConnection = require('./DB/DBconfig')
const {redisConnection} = require('./DB/redisConfig')
const errorMiddleware = require('./src/Middlewares/errorMiddleware')
const mountRoute = require('./src/Routes/mountRoute')



// Routes Mounting
mountRoute(app)



// Testing Route
app.get('/api/v1', (req, res) => {
    res.status(200).json({ message: "Welcome to Evalio APIs v1" })
})
app.get('/', (req, res) => {
    res.status(200).json("APIs Runs Well")
})

// Error Middlewares
app.use((req, res, next )=>{
    res.status(404).json({status:'fail',msg:`Page ${req.originalUrl} not found on this server`})
})
app.use(errorMiddleware)







const PORT  = process.env.PORT || 3000
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    dbConnection()
    redisConnection()
})


process.on('unhandledRejection', (err) => {
    console.log(`Unhandled Rejection: ${err.name} | ${err.message}`)
    server.close(() => {
        console.log('Shutting down...')
        process.exit(1)
    })
})