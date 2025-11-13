const express  = require('express')
const app = express()
require('dotenv').config()
const morgan = require('morgan')




// calling system middlewares
const dbConnection = require('./DB/DBconfig')


// Start using Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))






const PORT  = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    dbConnection()
})