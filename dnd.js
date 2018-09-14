var cnv;
var zoom = 10;
var gridSpacing = 50;
var zoomSpeed = 1;
var xOff = 0;
var yOff = 0;
var hX, hY;
var barbImg;
var hiLi = {
   isHigh: false,
   posX: 0,
   posY: 0
};
var buttons = [];
var buttonProps = [];
var characters = [];
var walls = [];
var characterImgDict = [];
var selectedChar;
var clickedOnButton = false;

var showMenuButton ={
   showMenu: false,
   posX: 10,
   posY: 100,
   width: 50,
   height: 30,
   text: "More",
   show: true,
   fnc: function(butt) {
      clickedOnButton = true;
      this.showMenu = !this.showMenu;
      if(this.showMenu){
         butt.style('background-color', coolors.blue);
      }else{
         editButton.editWalls = false;
         buttons.forEach(b => {
            b.style('background-color', coolors.gray);
         });
      }

      buttons.forEach(b => {
         this.showMenu ? b.show() : (b!==butt ? b.hide() : b.show());
      });
      redrawAll();
   }
};
var editButton ={
   editWalls: false,
   posX: 10,
   posY: 150,
   width: 50,
   height: 30,
   text: "Edit",
   show: false,
   // firstClick: true,
   fnc: function(butt) {
      clickedOnButton = true;
      this.editWalls = !this.editWalls;
      if(this.editWalls){
         butt.style('background-color', coolors.blue)
         // this.firstClick = true;
      }else{
         butt.style('background-color', coolors.gray);
         building.wallStarted = false;
      }
   }
};
var addCharButton ={
   waitingOnClick: false,
   posX: 10,
   posY: 200,
   width: 50,
   height: 30,
   text: "Add",
   show: false,
   fnc: function(butt) {
      clickedOnButton = true;
      var url = prompt("Please enter image url", "");
      if(url!=null){
         if(findInDict(url)===-1){
            var img = loadImage(url, (img) => {
               console.log("finished loading image");
               characterImgDict.push({
                  key: url,
                  value: img
               });
               characters.push({
                  posX : 0,
                  posY: 0,
                  showStats: true,
                  url,
               });
               updateServerChars();
               redrawAll();
            });
         }else{
            var img = characterImgDict[findInDict(url)].value;
            characters.push({
               posX : 0,
               posY: 0,
               showStats: true,
               url,
            });
            updateServerChars();
            redrawAll();

         }
      }

   }
};
var downloadMap ={
   waitingOnClick: false,
   posX: 10,
   posY: 250,
   width: 50,
   height: 30,
   text: "Down",
   show: false,
   fnc: function(butt) {
      clickedOnButton = true;
      var name = prompt("Name the file:", "");
      if(name!=null){
         var toSave = {
            x1s: [],
            x2s: [],
            y1s: [],
            y2s: [],
         };
         for(var i = 0; i<walls.length; i++){
            toSave.x1s.push(walls[i].x1);
            toSave.y1s.push(walls[i].y1);
            toSave.x2s.push(walls[i].x2);
            toSave.y2s.push(walls[i].y2);
         }
         var blob = new Blob([JSON.stringify(toSave)], {type: "text/plain;charset=utf-8"});
         saveAs(blob, name+'.txt');
      }
   }
};
var uploadMap ={
   waitingOnClick: false,
   posX: 10,
   posY: 300,
   width: 50,
   height: 30,
   text: "Up",
   show: false,
   fnc: function(butt) {
      clickedOnButton = true;
      // var file = document.getElementById('file-input').click();
      // console.log(document.getElementById('file-input').files[0]);
      // console.log(file);
      // selectInput("Select a map:", "fileSelected");
      // if (selection == null) {
      //    println("Window was closed or the user hit cancel.");
      // } else {
      //    println("User selected " + selection.getAbsolutePath());
      // }
   }
};

var building ={
   wallStarted: false,
   firstCornerX: 0,
   firstCornerY: 0,
   wallWidth : 4
};
var myHexC = document.location.href.substring(document.location.href.lastIndexOf("/")+1, );


function preload() {
   setupSocket();
   getChars();
   setupCoolors();
}

function findInDict(url){
   for(var i = 0; i<characterImgDict.length; i++){
      if(characterImgDict[i].key===url){
         return i;
      }
   }
   return -1;
}

function loadCharImages(){
   for(var i = 0; i<characters.length; i++){
      if(findInDict(characters[i].url)===-1){
         var img = loadImage(characters[i].url, (img, i) => {
            console.log("finished loading image");
            redrawAll();
            // characterImgDict.push({
            //    key:characters[i].url,
            //    value: img
            // });
         });
         characterImgDict.push({
            key:characters[i].url,
            value: img
         });
      }
   }
}

function getChars(){
   // var myHexC = document.location.href.substring(document.location.href.lastIndexOf("/")+1, );
   var toSend = {
      request: "getChars",
      hexC: myHexC
   };
   socketSend(toSend);
}

function setup() {
   cnv = createCanvas( windowWidth, windowHeight );
   setupButtons();
   getMap();
   redrawAll();
}


function getMap(){
   // var myHexC = document.location.href.substring(document.location.href.lastIndexOf("/")+1, );
   var toSend = {
      request: "getMap",
      hexC: myHexC
   };
   socketSend(toSend);
}

function onServerMessage(msg){
   console.log("on server message", msg.request);
   if(msg.status==="success"){
      if(msg.request==="getMap"){
         walls = msg.map;
         redrawAll();
      }else if(msg.request === "updateWalls"){
         walls = msg.map;
         redrawAll();
      }else if(msg.request === "updateChars"){
         characters = msg.characters;
         console.log("from server chars: ", msg.characters);
         loadCharImages();
         redrawAll();
      }else if(msg.request === "getChars"){
         characters = msg.characters;
         loadCharImages();
         redrawAll();
      }
   }
}
function updateServerWalls(){
   // var myHexC = document.location.href.substring(document.location.href.lastIndexOf("/")+1, );
   var toSend = {
      request: "updateWalls",
      hexC: myHexC,
      walls
   };
   socketSend(toSend);
}

function updateServerChars(){
   // var myHexC = document.location.href.substring(document.location.href.lastIndexOf("/")+1, );
   var toSend = {
      request: "updateChars",
      hexC: myHexC,
      characters
   };
   socketSend(toSend);
}

function setupButtons(){
   buttonProps.push(showMenuButton);
   buttonProps.push(editButton);
   buttonProps.push(addCharButton);
   buttonProps.push(downloadMap);
   buttonProps.push(uploadMap);
   buttonProps.forEach(bp => {
      var button = createButton(bp.text);
      button.position(bp.posX, bp.posY);
      button.size(bp.width, bp.height);
      bp.myButton = button;
      button.style('background-color', coolors.white);
      button.style('outline', 'none');
      button.style('border', '2px solid ' + coolors.orange);
      button.mousePressed(function () {bp.fnc(button);});
      (bp.show) ? button.show() : button.hide();
      buttons.push(button);
   });
   buttons[buttons.length-1].drop(uploadFile);
}

function uploadFile(file){
   if(file.type==='text'){
      var rec = JSON.parse(file.data);
      var newmap = [];
      for(var i = 0; i<rec.x1s.length; i++){
         newmap.push({
            x1: rec.x1s[i],
            y1: rec.y1s[i],
            x2: rec.x2s[i],
            y2: rec.y2s[i]
         });
      }
      walls = newmap;
      updateServerWalls();
   }
}

// function setupChars() {
//    characters.push({ //barb
//       posX : 10,
//       posY: 5,
//       url: 'https://i.imgur.com/Iz0Lmqt.png',
//       image: 0
//    });
//    updateServerChars();
//    redrawAll();
// }

function moveGrid() {
   redrawAll();
}

function draw() {
   var x = (windowWidth - width) / 2;
   var y = (windowHeight - height) / 2;
   cnv.position(x, y);
}

function drawGrid() {
   stroke( coolors.gray );
   for(var i = 0; i < (windowWidth / gridSpacing); i++) {
      line(i * gridSpacing, 0, i * gridSpacing, windowHeight);
   }
   for(var i = 0; i < (windowHeight / gridSpacing); i++) {
      line(0, i * gridSpacing, windowWidth, i * gridSpacing);
   }
}

function drawChars() {
   if(characters.length>0){
      characters.forEach(character => {
         var i = findInDict(character.url);
         if(i!==-1){
            image(characterImgDict[i].value,
            (character.posX + xOff) * gridSpacing,
            (character.posY + yOff) * gridSpacing,
            gridSpacing,
            gridSpacing);
         }
      });
   }
}


function drawHiLi() {
   if( hiLi.isHigh ) {
      stroke( coolors.blue );
      strokeWeight( 2 );
      fill( coolors.white );
      rect( (hiLi.posX + xOff) * gridSpacing,
            (hiLi.posY + yOff) * gridSpacing,
            gridSpacing,
            gridSpacing);
      strokeWeight( 1 );
   }
}

function drawMenu(){
   strokeWeight( 2 );
   stroke(coolors.black);
   fill(coolors.rasp);
   if(showMenuButton.showMenu){
      rect(0,90,75,buttons.length*50);
   }else{
      rect(0,90,75,50);

   }
   strokeWeight( 1 );

}

function drawWalls(){
   walls.forEach(w => {
      strokeWeight(building.wallWidth);
      stroke(coolors.black);
      fill(coolors.black);
      line((w.x1+xOff)*gridSpacing, (w.y1+yOff)*gridSpacing, (w.x2+xOff)*gridSpacing, (w.y2+yOff)*gridSpacing);
      strokeWeight(1);
   });
}

function redrawAll() {
   clear();
   background( coolors.white );
   drawGrid();
   drawWalls();
   drawHiLi();
   drawChars();
   drawMenu();
}

function editWallsClick(gx, gy){
   var gx = Math.round(mouseX / gridSpacing) - xOff;
   var gy = Math.round(mouseY / gridSpacing) - yOff;

   if(!clickedOnButton){
      if(building.wallStarted){
         building.wallStarted = false;
         var remove = false;
         for(var i = 0; i<walls.length; i++){
            w = walls[i];
            if((w.x1 === building.firstCornerX && w.x2 === gx) || (w.x2 === building.firstCornerX && w.x1 === gx)){
               if((w.y1 === building.firstCornerY && w.y2 === gy) || (w.y2 === building.firstCornerY && w.y1 === gy)){
                  walls.splice(i, 1);
                  remove = true;
               }
            }
         }
         if(!remove){
            walls.push({
               x1: building.firstCornerX,
               y1: building.firstCornerY,
               x2: gx,
               y2: gy
            });
         }
         updateServerWalls();
      }else{
         building.firstCornerX = gx;
         building.firstCornerY = gy;
         building.wallStarted = true;
      }
   // }else{
   //    editButton.firstClick = false;
   // }
   }
}

function playClick(gx, gy){
   var clickedOnChar = false;
   characters.forEach(character => {
      if( gx == character.posX && gy == character.posY )
         clickedOnChar = true;
   });
   if( clickedOnChar ) {
      hiLi.posX = gx;
      hiLi.posY = gy;
      characters.forEach(character => {
         if(hiLi.posX == character.posX && hiLi.posY == character.posY) {
            selectedChar = character;
         }
      });
      hiLi.isHigh = true;
   } else {
      if(hiLi.isHigh){
         selectedChar.posX = gx;
         selectedChar.posY = gy;
         updateServerChars();
         hiLi.isHigh = false;
      }
   }
}


function mousePressed() {
   if(!clickedOnButton){
      var gx = Math.floor(mouseX / gridSpacing) - xOff;
      var gy = Math.floor(mouseY / gridSpacing) - yOff;
      if(editButton.editWalls){
         editWallsClick(gx, gy);
      }else{
         playClick(gx, gy);
      }
      redrawAll();
   }else{
      clickedOnButton = false;
   }
}

function keyPressed() {
   switch( keyCode ) {
      case 187: // +
         gridSpacing += zoomSpeed;
         break;
      case 189: // -
         gridSpacing > zoomSpeed ? gridSpacing -= zoomSpeed : null;
         break;
      case 37: // left
         xOff++;
         break;
      case 39: // right
         xOff--;
         break;
      case 38: // up
         yOff++;
         break;
      case 40: // down
         yOff--;
         break;
      default:
         break;
   }
   redrawAll();
}
