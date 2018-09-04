
// if a directory needs to be served
const path = require('path');
// for webserver
const express = require('express');
// parse POST data uploaded from client
const parser = require('body-parser');
// for cross origin requests
const cors = require('cors');
// express web server
const app = express();
// required so we can have a socket server alongside webserver
const server = require('http').Server(app);
// websocket server running on the same port as http
const io = require('socket.io')(server);

// which port to listen on, accepts requests from ALL ip addresses
// access this server with http://ip:port/
// this case http://localshot:5000/
server.listen(process.env.PORT || 5000);
app.use(express.static(__dirname));

// cross origin requests accepted
app.use(cors());
app.use(parser.json());
app.use(parser.urlencoded({extended: true}));

// if you want to serve all files from a certain (this) directory
// then any file in the directory can be accessed with
// http://ip:port/filename.extension
// app.use(express.static(path.resolve(__dirname))))

// what happens when server gets a GET request to path * (any)
// path can be replaced with / or anything else
// http://localhost:5000/path
app.get('/', (req, res) => {
  // req is the request, res is the resolution (packet sent back)
  // res can send a file with .sendFile, that can be an html
  res.sendFile(path.resolve(__dirname+'/index.html'));
  // res.send('Hello Universe!');
});

// connection event emitted when something connects to the websocket server
io.on('connection', function(socket) {
  // socket is the connection to the client
  // socket.emit sends connected event back to the client with specified msg
  socket.emit('connected', 'Connected to server!');
  // how the server responds when the client sends a message
  socket.on('message', function(data) {
    // io.emit sends the event (message) and data to ALL socket connections
    // ie other clients
    io.emit('message', data);
    // just send a confirmation event back to client to signal receive
    socket.emit('confirmation', data);
  });
  // what happens when a client disconnects, not sure what's the event emitted
  // usually diconnect, close, or exit
  // socket.on('disconnect', _ => {
    // logic
  // });
});
