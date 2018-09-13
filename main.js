var cnv;

var lobbyBack = {
   width : 0.3,
   height : 0.3,
   hm: 0.35,
   bufferW: 0.1,
   bufferH: 0.02,
   lineBuffer: 0.003,
   strokeWeight: 6,
   lines: 6
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
var scrollbar = {
   needScrollbar : false,
   scrollVal : 0,
   width: 0.4,
   barW: 0.8,
   r : 1
};

var slider;
var rediviva;
var morris;

function drawLobbyBack(){
   strokeWeight(lobbyBack.strokeWeight);
   stroke(coolors.black);
   fill(coolors.rasp);
   var w = windowWidth;
   var h = windowHeight;
   rect(((w/2) - lobbyBack.width*w), ((h*lobbyBack.hm) - lobbyBack.height*h), lobbyBack.width*w*2, lobbyBack.height*h*2);
   strokeWeight(1);
}

function setupLobbies(){
   jQuery.post("/lobbies/init", "", (data, status) => {
      if(data.status===200){
         lobbies = data.lobbies;
         setupLobbyButtons();
         drawScrollbar();
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
   drawScrollbar();
}

function setupRefresh(){
   refreshButton = createButton("↻");
   var w = windowWidth;
   var h = windowHeight;
   var mw = scrollbar.width*lobbyBack.bufferW*w;
   refreshButton.position((w/2) - lobbyBack.width*w+lobbyBack.strokeWeight/2, h*(lobbyBack.hm + lobbyBack.height)-mw);
   refreshButton.size(mw-lobbyBack.strokeWeight/2, mw-lobbyBack.strokeWeight/2);
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
      scrollbar.needScrollbar = true;
   }else{
      numOB = lobbies.length;
      scrollbar.needScrollbar = false;
   }
   for(var i=0; i<numOB; i++){
      let button = createButton("Lobby name: " + lobbies[i]);
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
   setupScrollbar();
}

function setupScrollbar(){
   var w = windowWidth;
   var h = windowHeight;
   var mw = scrollbar.width*lobbyBack.bufferW*w;
   // if(scrollbar.needScrollbar){
   //    scrollbar.r = lobbyBack.lines/lobbies.length;
   // }else{
   //    scrollbar.r = 1;
   // }
   // fill(coolors.white);
   // noStroke();
   // scrollbar.barBack = rect((w/2) + lobbyBack.width*w-mw-lobbyBack.strokeWeight/2, (h*lobbyBack.hm) - lobbyBack.height*h+mw,
   // mw, lobbyBack.height*2*h-2*mw);
   // fill(coolors.dblue);
   // strokeWeight(2);
   // stroke(coolors.black);
   // scrollbar.bar = rect(
   //    (w/2) + lobbyBack.width*w-mw+((1-scrollbar.barW)/2)*mw-lobbyBack.strokeWeight/2,
   //    (h*lobbyBack.hm) - lobbyBack.height*h+mw,
   //    mw*scrollbar.barW,
   //    (lobbyBack.height*2*h-2*mw)*scrollbar.r,
   //    3);
   scrollbar.up = createButton("▲");
   scrollbar.up.position(
      (w/2) + lobbyBack.width*w-mw-lobbyBack.strokeWeight/2,
      (h*lobbyBack.hm) - lobbyBack.height*h+lobbyBack.strokeWeight/2);
   scrollbar.up.size(mw, mw);
   scrollbar.up.style('background-color', coolors.white);
   scrollbar.up.style('outline', 'none');
   scrollbar.up.style('color', coolors.black);
   scrollbar.up.style('font-size', '15px');
   scrollbar.up.style('border', '2px solid ' + coolors.gray);
   scrollbar.up.mousePressed(() => {
      scrollbarMove("UP");
   });
   scrollbar.down = createButton("▼");
   scrollbar.down.position(
      (w/2) + lobbyBack.width*w-mw-lobbyBack.strokeWeight/2,
      (h*lobbyBack.hm) + lobbyBack.height*h-mw-lobbyBack.strokeWeight/2);
   scrollbar.down.size(mw, mw);
   scrollbar.down.style('background-color', coolors.white);
   scrollbar.down.style('outline', 'none');
   scrollbar.down.style('color', coolors.black);
   scrollbar.down.style('font-size', '15px');
   scrollbar.down.style('border', '2px solid ' + coolors.gray);
   scrollbar.down.mousePressed(() => {
      scrollbarMove("DOWN");
   });
   scrollbar.up.hide();
   drawScrollbar();
}

function scrollbarMove(direction){
   var diff = lobbies.length-lobbyBack.lines;
   console.log(diff);
   if(scrollbar.needScrollbar){
      if(direction==="UP"){ //if up pressed
         if(scrollbar.scrollVal>0){ //if anywhere to go up
            scrollbar.scrollVal--;
            scrollbar.down.show();
            if(scrollbar.scrollVal===0){
               console.log("can't go up");
               scrollbar.up.hide();
            }
         }
      }else if(direction==="DOWN"){
         if(scrollbar.scrollVal<diff){ //if anywhere to go down
            scrollbar.scrollVal++;
            scrollbar.up.show();
            if(scrollbar.scrollVal===diff){
               console.log("can't go down");
               scrollbar.down.hide();
            }
         }
      }
      for(var i = 0; i<buttons.length; i++){
         buttons[i].html("Lobby name: " + lobbies[i+scrollbar.scrollVal]);
      }
   }
}

function drawScrollbar(){
   if(lobbies.length>lobbyBack.lines){
      scrollbar.needScrollbar = true;
      scrollbar.up.show();
      scrollbar.down.show();
   }else{
      scrollbar.needScrollbar = false;
      scrollbar.up.hide();
      scrollbar.down.hide();
   }
   // fill(coolors.white);
   // noStroke();
   // scrollbar.barBack = rect((w/2) + lobbyBack.width*w-mw-lobbyBack.strokeWeight/2, (h*lobbyBack.hm) - lobbyBack.height*h+mw,
   // mw, lobbyBack.height*2*h-2*mw);
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
   button.style('font-size', '40px');
   button.style('font-family', 'morrisroman-black');
   button.style('border', '2px solid ' + coolors.black);
   button.mousePressed(newLobby.fcn);
   // redrawAll();
}

function preload(){
   setupCoolors();
   // rediviva = loadFont('assets/rediviva.ttf');
   morris = loadFont('assets/MorrisRoman-Black.ttf');
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
