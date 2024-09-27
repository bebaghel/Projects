const express = require('express')

const DBConnetion = require('./config/db')
const path = require('path')
const app = express();
DBConnetion();
const port = 3000;
const User = require('./model/user')
const Post = require('./model/user')
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const data = require('./routes/index')
app.use('/', data)


// Create and save documents
async function createData() {
    const user = new User({ name: 'John Doe' });
    await user.save();

    const post = new Post({
        title: 'My First Post',
        content: 'This is the content of my first post.',
        author: user._id
    });
    await post.save();

    console.log('Data created');
}

// Querying with populated references

app.get('/', async (req, res) => {
    const posts = await Post.find().populate('author');
    console.log(posts);

})



app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})