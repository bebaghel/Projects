const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const secretKey = 'your_secret_key'; // Keep this secret

const connectDB = require('./config/db')
app.use(bodyParser.json());

connectDB();
const users = require('./model/User')
// Login route
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({status: false, msg: 'User not exist' });
        }
        const passwordMatch = await user.comparePassword(password);

        if (passwordMatch) {
            const token = user.generateToken();
            const userdata = user.toObject();
            delete userdata.password;
            return res.json({ status: true, message: 'Login successful', token, response: userdata });
        } else {
            return res.status(401).json({ status: false, message: 'Incorrect password' });
        }
    } catch (error) {
        return res.status(500).json({ msg: 'Error processing request', error: error.message });
    }
});

// Protected route
app.get('/protected', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).send('Access denied');
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).send('Invalid token');
        }
        res.send('Protected data');
    });
});

app.listen(5000, () => {
    console.log('Server running on 5000');
});
