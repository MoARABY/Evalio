const express  = require('express')
const app = express()
require('dotenv').config()
const morgan = require('morgan')
const cookieParser = require('cookie-parser')


// Start using Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

// calling system middlewares
const dbConnection = require('./DB/DBconfig')
const errorMiddleware = require('./src/Middlewares/errorMiddleware')
const AppError = require('./src/Utils/appError')
const userRoutes = require('./src/Routes/userRoutes')
const authRoutes = require('./src/Routes/authRoute')


// Routes Middleware
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/auth', authRoutes)
app.get('/api/v1', (req, res) => {
    res.status(200).json({ message: "Welcome to Evalio APIs v1" })
})
app.get('/', (req, res) => {
    res.status(200).json("APIs Runs Well")
})

// Error Middleware

// app.all('*',(req,res)=>{
//     res.status(404).json({status:'fail',msg:'page not found'})
// })
app.use((req, res, next )=>{
    res.status(404).json({status:'fail',msg:`Can't find ${req.originalUrl} on this server`})
})
app.use(errorMiddleware)







const PORT  = process.env.PORT || 3000
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    dbConnection()
})


process.on('unhandledRejection', (err) => {
    console.log(`Unhandled Rejection: ${err.name} | ${err.message}`)
    server.close(() => {
        console.log('Shutting down...')
        process.exit(1)
    })
})