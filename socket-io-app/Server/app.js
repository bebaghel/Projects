const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});


let messages = [];
let socketsConnected = new Set();

io.on('connection', (socket) => {
    console.log("Client Connected: ", socket.id);
    socketsConnected.add(socket.id);
    io.emit('clients-total', socketsConnected.size);

    // Send existing messages to the newly connected client
    socket.emit('previousMessages', messages);

    socket.on('disconnect', () => {
        console.log("Socket id is disconnected", socket.id);
        socketsConnected.delete(socket.id);
        io.emit('clients-total', socketsConnected.size);
    });

    socket.on('message', (data) => {
        console.log("Data received:", data);
        messages.push(data);  // Store message on the server
        socket.broadcast.emit('giveAnyName', data); // Send message to other clients
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
