const mongoose = require('mongoose');
const colors = require('colors')

//
const connectDB = async () => {
    try {
        await  mongoose.connect(process.env.MONGO_URL)
        console.log(`Data base connect succefuly ${mongoose.connection.host}`.bgGreen.white)
    } catch (error) {
        console.log(`MongoDb Server wrong ${error}`.bgRed.white)
    }
}

module.exports = connectDB