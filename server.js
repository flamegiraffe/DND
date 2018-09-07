
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

var db = [];

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
  res.sendFile(path.resolve(__dirname+'/main.html'));
  // res.send('Hello Universe!');
});
app.get('/play', (req, res) => {
  // req is the request, res is the resolution (packet sent back)
  // res can send a file with .sendFile, that can be an html
  res.sendFile(path.resolve(__dirname+'/play.html'));
  // res.send('Hello Universe!');
});

app.post('/checkpass', function(req, res) {
   // console.log('server received data');
   // console.log('body is ',req.body);
   console.log(req.body);
   // var jsonr = JSON.parse(req.body);
   // console.log(jsonr);
   console.log('server received lobby: ' + req.body.lobby + " and pass: " + req.body.pass);
   var check = checkHexCode(req.body.lobby, req.body.pass);
   if(check!==undefined){
      res.send({hexCode: check, status: 200});
   }else{
      res.send({hexCode: undefined, status: "Incorrect password"});
   }
});

app.post('/makelobby', function(req, res) {
   // console.log('server received data');
   // console.log('body is ',req.body);
   console.log(req.body);
   // var jsonr = JSON.parse(req.body);
   // console.log(jsonr);
   console.log('server received lobby: ' + req.body.lobby + " and pass: " + req.body.pass);
   var lobbyNameTaken = false;
   for(var i = 0; i<db.length; i++){
      if(db[i].lobby===req.body.lobby){
         lobbyNameTaken = true;
      }
   }
   if(!lobbyNameTaken){
      var newHC = registerNewLobby(req.body.lobby, req.body.pass);
      console.log(db);
      res.send({hexCode: newHC, status: 200});
   }else{
      res.send({hexCode: undefined, status: "Lobby name already taken"});
   }
});

app.post('/lobbies/init', function(req, res) {
   // // console.log('server received data');
   // // console.log('body is ',req.body);
   // console.log(req.body);
   // // var jsonr = JSON.parse(req.body);
   // // console.log(jsonr);
   // console.log('server received lobby: ' + req.body.lobby + " and pass: " + req.body.pass);
   // var check = checkHexCode(req.body.lobby, req.body.pass);
   // if(check!==undefined){
   //    res.send({hexCode: check, status: 200});
   // }else{
   //    res.send({hexCode: undefined, status: "Incorrect password"});
   // }
});
// connection event emitted when something connects to the websocket server
io.on('connection', function(socket) {
  // socket is the connection to the client
  // socket.emit sends connected event back to the client with specified msg
  socket.emit('connected', 'Connected to server!');
  // how the server responds when the client sends a message
  socket.on('message', function(data) {
   console.log("socket received", data);
   // io.emit sends the event (message) and data to ALL socket connections
   // ie other clients
   if(data.request!==undefined){
      console.log("client requested", data.request, "with hexC", data.hexC);
      if(data.request === "getMap"){
         for(var i = 0; i<db.length; i++){
            if(db[i].hexCode === data.hexC){
               var toSend = {
                  status: "success",
                  request: data.request,
                  map: db[i].map
               };
               io.emit('message', toSend);
            }
         }
      }else if(data.request === "updateWalls"){
         for(var i = 0; i<db.length; i++){
            if(db[i].hexCode === data.hexC){
               db[i].map = data.walls;
               var toSend = {
                  status: "success",
                  request: data.request,
                  map: db[i].map
               };
               io.emit('message', toSend);
            }
         }
      }else if(data.request === "updateChars"){
         for(var i = 0; i<db.length; i++){
            if(db[i].hexCode === data.hexC){
               db[i].chars = data.characters;
               var toSend = {
                  status: "success",
                  request: data.request,
                  characters: db[i].chars
               };
               io.emit('message', toSend);
            }
         }
      }
   }else{
      console.log("data.request undefined");
   }
   // io.emit('message', data);
   // just send a confirmation event back to client to signal receive
   socket.emit('confirmation', data);
  });
  // what happens when a client disconnects, not sure what's the event emitted
  // usually diconnect, close, or exit
  // socket.on('disconnect', _ => {
    // logic
  // });
});

function generateHex(lobby, pass){
   return (lobby + pass); //TODO
}

function checkHexCode(lobby, pass){
   var toCheck = generateHex(lobby, pass);
   console.log("hex to check:", toCheck);
   var found = false;
   // for(var i = 0; i<hexCodes.length; i++){
   //    if(toCheck===hexCodes[i]){
   //       console.log("found", hexCodes[i], maps[i]);
   //       found = true;
   //       return maps[i];
   //    }
   // }
   for(var i=0; i<db.length; i++){
      if(toCheck === db[i].hexCode){
         console.log("found", db[i].hexCode, db[i].map);
         found = true;
         return db[i].hexCode;
      }
   }
   if(!found){
      console.log("did not find", toCheck);
      return undefined;
   }
}

function registerNewLobby(lobby, pass){
   var hexC = generateHex(lobby, pass);
   app.get(`/${hexC}`, (req, res) => {
     res.sendFile(path.resolve(__dirname+'/play.html'));
   });
   db.push({
      lobby,
      hexCode: hexC,
      map: [],
      characters: []
   });
   return hexC;
   // lobbies.push(lobby);
   // hexCodes.push(hexC);
   // maps.push(`map of ${hexC}`);
}

// checkHexCode("bol", "sap");
