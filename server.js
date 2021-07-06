const express = require('express');
const app = express();
const path = require('path');

const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);

const formatMessage = require('./utils/message');
const {userJoins,userLeaves,getCurrentUser,getRoomUsers} = require('./utils/users');
const botName = 'Lucia Bot';

app.use(express.static(path.join(__dirname,'public')));


// when user connects to socket
io.on('connection', (socket) => {

  socket.on('joinRoom',(info)=>{
    // create a user
    const user = userJoins(socket.id,info.username,info.room);
    socket.join(user.room);

    // Welcome the user
    socket.emit('message',formatMessage(botName,` Welcome to Welegram, ${info.username}! Happy Chatting...`));
    // Broadcasts when an user connects
    socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${info.username} has joined the chat`));
    
    // sending users and room info
    io.to(user.room).emit('roomUsers',{
      room:user.room,
      users:getRoomUsers(user.room)
    })
  })

  // Listening on messages sent by client
  socket.on('enteredMessage',(msg)=>{
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message',formatMessage(user.username,msg));
  })

  // When user disconnects
  socket.on('disconnect',()=>{
    const user = userLeaves(socket.id);
    if(user){
      io.to(user.room).emit('message',formatMessage(botName,`${user.username} left`));

      // sending users and room info
      io.to(user.room).emit('roomUsers',{
        room:user.room,
        users:getRoomUsers(user.room)
      })
    }

  });
});


// creating a http server
const PORT = 3000 || process.env.PORT;
server.listen(PORT, ()=> console.log(`Server running on ${PORT}`));