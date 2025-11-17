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

// calling system routes
const dbConnection = require('./DB/DBconfig')
const errorMiddleware = require('./src/Middlewares/errorMiddleware')
const userRoutes = require('./src/Routes/userRoutes')
const authRoutes = require('./src/Routes/authRoute')
const academicYearRoute = require('./src/Routes/academicYearRoute')
const academicTermRoute = require('./src/Routes/academicTermRoute')
const subjectRoute = require('./src/Routes/subjectRoute')
const classLevelRoute = require('./src/Routes/classLevelRoute')


// Routes Mounting
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/academic-years', academicYearRoute)
app.use('/api/v1/academic-terms', academicTermRoute)
app.use('/api/v1/subjects', subjectRoute)
app.use('/api/v1/class-levels', classLevelRoute)


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
})


process.on('unhandledRejection', (err) => {
    console.log(`Unhandled Rejection: ${err.name} | ${err.message}`)
    server.close(() => {
        console.log('Shutting down...')
        process.exit(1)
    })
})