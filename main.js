var cnv;

var lobbyBack = {
   width : 0.3,
   height : 0.2,
   hm: 0.3,
   bufferW: 0.03,
   bufferH: 0.02,
   lineBuffer: 0.003,
   lines: 5
};

var lobbyDef = {
   lobbyName: "lobby name",
   posX: 25,
   posY: 25,
   width: 100,
   height: 25,
   fcn: function(){
      var inp = prompt("Please enter password", "");
      if (inp != null) {
         jQuery.post("/checkpass", {lobby: lobbyName, pass: inp}, (data, status) => {
            if(data.status!==200){
               console.log(data.status);
            }else{
               document.location.href = "/"+data.hexCode;
            }
         });
      }
   }
};

var newLobby = {
   text: "Create new lobby",
   hm: 0.7,
   width: 0.15,
   height: 0.1,
   fcn: function(){
      var lb = prompt("Please enter new lobby name", "");
      if(lb!=null){
         var pw = prompt("Please enter new password", "");
         if(pw!=null){
            jQuery.post("/makelobby", {lobby: lb, pass: pw}, (data, status) => {
               // console.log(data);
               if(data.status!==200){
                  console.log(data.status);
               }else{
                  document.location.href = "/"+data.hexCode;
               }
            });
         }
      }
   }
}

var lobbies =[];
var buttons = [];
var refreshButton;
var scrollBar = false;
var scrollVal = 0;

function drawLobbyBack(){
   strokeWeight(5);
   stroke(coolors.black);
   fill(coolors.rasp);
   var w = windowWidth;
   var h = windowHeight;
   rect(((w/2) - lobbyBack.width*w), ((h*lobbyBack.hm) - lobbyBack.height*h), lobbyBack.width*w*2, lobbyBack.height*h*2);
   strokeWeight(1);
}

function setupLobbies(){
   // jQuery.post("/makelobby", {lobby: "bol", pass: "sap"}, (data, status) => {
   //    // console.log(data);
   //    if(data.status===200){
   //       jQuery.post("/lobbies/init", "", (data, status) => {
   //          // console.log(data);
   //          if(data.status===200){
   //             lobbies = data.lobbies;
   //             setupLobbyButtons();
   //          }
   //       });
   //    }
   // });
   jQuery.post("/lobbies/init", "", (data, status) => {
      if(data.status===200){
         lobbies = data.lobbies;
         setupLobbyButtons();
      }
   });
}

function refresh(){
   jQuery.post("/lobbies/init", "", (data, status) => {
      if(data.status===200){
         lobbies = data.lobbies;
         setupLobbyButtons();
      }
   });
}

function setupRefresh(){
   refreshButton = createButton("↻");
   var w = windowWidth;
   var h = windowHeight;
   refreshButton.position((w/2) - lobbyBack.width*w+3, h*(lobbyBack.hm + lobbyBack.height)-lobbyBack.bufferW*w-2);
   refreshButton.size(lobbyBack.bufferW*w, lobbyBack.bufferW*w);
   refreshButton.style('background-color', coolors.white);
   refreshButton.style('outline', 'none');
   refreshButton.style('color', coolors.rasp);
   refreshButton.style('font-size', '20px');
   refreshButton.style('border', '2px solid ' + coolors.gray);
   refreshButton.mousePressed(refresh);
}

function setupLobbyButtons(){
   var numOB;
   if(lobbies.length>lobbyBack.lines){
      numOB = lobbyBack.lines;
   }else{
      numOB = lobbies.length;
   }
   for(var i=0; i<numOB; i++){
      var button = createButton("Lobby name: " + lobbies[i]);
      var w = windowWidth;
      var h = windowHeight;
      button.size(
         (lobbyBack.width-lobbyBack.bufferW)*w*2,
         (((lobbyBack.height-lobbyBack.bufferH)*h*2)/lobbyBack.lines)-(lobbyBack.lines-1)*lobbyBack.lineBuffer * h
      );
      button.position(
         (w/2)-(lobbyBack.width*w)+lobbyBack.bufferW*w,
         ((h*lobbyBack.hm) - lobbyBack.height * h)
         +lobbyBack.bufferH * h
         +((lobbyBack.height-lobbyBack.bufferH)*h*2*i/lobbyBack.lines)
         +i*lobbyBack.lineBuffer * h
      );

      button.style('font-size', '15px');
      button.style('background-color', coolors.white);
      button.style('outline', 'none');
      button.style('border', '3px solid ' + coolors.gray);
      button.mousePressed(() => {
         lobbyButton(button.html().substring(button.html().lastIndexOf(":")+2,));
      });
      buttons.push(button);
   }
}


function lobbyButton(lobbyName){
   console.log(lobbyName);
   var inp = prompt("Please enter password", "");
   if (inp != null) {
      jQuery.post("/checkpass", {lobby: lobbyName, pass: inp}, (data, status) => {
         if(data.status!==200){
            console.log(data.status);
         }else{
            document.location.href = "/"+data.hexCode;
         }
      });
   }
}

function drawNewLobby(){
   var button = createButton(newLobby.text);
   button.position(windowWidth/2-newLobby.width*windowWidth, newLobby.hm*windowHeight-newLobby.height);
   button.size(newLobby.width*windowWidth*2, newLobby.height*windowHeight);
   button.style('background-color', coolors.rasp);
   button.style('outline', 'none');
   button.style('color', coolors.white);
   button.style('font-size', '20px');
   button.style('border', '2px solid ' + coolors.black);
   button.mousePressed(newLobby.fcn);
   // redrawAll();
}

function preload(){
   setupCoolors();
}


function setup(){
   cnv = createCanvas(windowWidth, windowHeight);
   background(coolors.white);
   drawLobbyBack();
   setupLobbies();
   drawNewLobby();
   setupRefresh();
   // redrawAll();
}
function redrawAll(){
   // clear();
   // background(coolors.white);
   // drawLobbyBack();
   // showButtons();
   // drawNewLobby();
   // checkHover();
   // drawButtons();
}

function draw(){
   var x = (windowWidth - width) / 2;
   var y = (windowHeight - height) / 2;
   cnv.position(x, y);
}
