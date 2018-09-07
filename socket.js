// send stuff to websocket server
// ws.send(data)
// respond to messages from server
var ws;
function setupSocket(){
   var h;
   location.hostname=='localhost' ? h=location.host : h=location.hostname;
   // connect to websocket server, ws is the socket
   ws = io.connect('https://' + h);
   ws.on('connected', msg => {
      console.log(msg);
      // window.alert(msg); // delete eventually because unneeded
   });
   ws.on('message', msg => {
      onServerMessage(msg);
   });
}
function socketSend(data){
   ws.send(data);
}
// function socketSend(data, callback){
//    ws.send(data);
//    ws.on('message', msg => {
//       callback(msg);
//    });
// }
