console.log('Hello world from socket.io!');
// socket.io

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

server.listen(process.env.PORT || 3000, function () {
  console.log('Server running in port 3000');
});

app.use(express.static(__dirname + '/public'));

const users = {};

// Event 'connection' when user from frontend joined to chat (For example opens a browser tab)
io.sockets.on('connection', client => {
  const broadcast = (event, data) => {
    client.emit(event, data); // Send data to current connected user
    client.broadcast.emit(event, data); // Send data to other connected users
  };

  // Sending a list of users when a new user is connected
  broadcast('user', users);

  // Event 'message' when user from frontend sent message
  client.on('message', message => {
    // Adding a user if it did not exist before
    if (users[client.id] !== message.name) {
      users[client.id] = message.name;
      broadcast('user', users);
    }

    // Sending a message to all users
    broadcast('message', message);
  });

  // Event 'disconnect' when user from frontend closed app
  client.on('disconnect', () => {
    delete users[client.id];
    client.broadcast.emit('user', users);
  });
});

// const { Server } = require('socket.io');
// const { createServer } = require('http');

// const httpServer = createServer();

// const io = new Server(httpServer, { cors: { original: '*' } });

// io.on('connection', socket => {
//   console.log('New frontend connection');
// });

// httpServer.listen(3001);

// const express = require('express');
// const app = express();

// const http = require('http').createServer(app);
// const io = require('socket.io')(http);

// app.use(express.static('public'));

// io.on('connection', socket => {
//   console.log('User connected!');
//   socket.emit('message', 'User connected!');
// });

// http.listen(3000, () => {
//   console.log('Listening on *:3000');
// });
