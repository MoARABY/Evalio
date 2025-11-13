const mongoose = require('mongoose')


const dbConnection = async () => {
    const  conn =  await mongoose.connect(process.env.DB_STRING)
    if(conn){
        console.log("Database connected successfully")
    } else {
        console.error(`Database connection failed ${error.message}`)
        process.exit(1)
    }
}

module.exports = dbConnection