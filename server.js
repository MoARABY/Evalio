const express  = require('express')
const app = express()
require('dotenv').config()
const morgan = require('morgan')




// calling system middlewares
const dbConnection = require('./DB/DBconfig')
const userRoutes = require('./src/Routes/userRoutes')

// Start using Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))


// Routes Middleware
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/', (req, res) => {
    res.status(200).json({ message: "Welcome to Evalio APIs v1" })
})
app.use('/', (req, res) => {
    res.status(200).json("APIs Runs Well")
})






const PORT  = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    dbConnection()
})