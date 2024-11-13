const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,

});
const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('User', userSchema)
module.exports = mongoose.model('Post', postSchema)


