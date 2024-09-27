const mongoose = require('mongoose')

const DB = () => {
    const url = "mongodb://127.0.0.1:27017/alpha"
    try {
        mongoose.connect(url)
        console.log("Mognodb connected successfully")
    } catch (error) {
        console.log('Connetion failed')
    }

}

module.exports = DB;