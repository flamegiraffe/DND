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
var menuProps = {
   STW: 2,
   buttonWidthP: 0.05,
   buttonHeightP: 0.05,
   heightStartP: 0.0,
   bufferW: 0.01,
   bufferH: 0.01
};
var rollTab = {
   showTab: false,
   widthP: 0.25,
   heightP: 0.15,
   textAct: "Roll",
   textDeact: "Hide",
   buttonWidthP: 0.05,
   textHeight: 0.4,
   buttonHeightP: 0.07,
   inpWidthP: 0.15,
   inpHeightP: 0.05,
   inpWidthC: 0.5,
   inpHeightC: 0.25,
   textBufferL: 0.1,
   textBufferD: 0.1,
   offBufferW: 0.01,
   offBufferH: 0.02,
   toggleRollTab: function() {
      clickedOnButton = true;
      if(rollTab.showTab){
         rollButton.html(rollTab.textAct);
         rollInp.hide();
      }else{
         rollButton.html(rollTab.textDeact);
         rollInp.show();
      }
      rollTab.showTab = !rollTab.showTab;
      redrawAll();
   }
};

var rolledVal ="";
var rollButton;
var rollInp;
var statsProps = {
   widthP: 0.25,
   heightP: 0.2,
   lineHeight: 0.2,
   bufferW: 0.1,
   bufferH: 0.1,
   lines: 3
};

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
         butt.style('background-color', coolors.orange);
      }else{
         editButton.editWalls = false;
         buttons.forEach(b => {
            b.style('background-color', coolors.white);
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
   text: "Edit Walls",
   show: false,
   // firstClick: true,
   fnc: function(butt) {
      clickedOnButton = true;
      this.editWalls = !this.editWalls;
      if(this.editWalls){
         butt.style('background-color', coolors.orange)
         // this.firstClick = true;
      }else{
         butt.style('background-color', coolors.white);
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
   text: "Create A Character",
   show: false,
   fnc: function(butt) {
      clickedOnButton = true;
      var name = prompt("Please enter character's name: ", "Robert Baratheon");
      if(name!=null){
         var url = prompt("Please enter image url", "");
         if(url!=null){
            var health = prompt("Please enter maximum health: ", "50");
            if(health!=null){
               var saveThrows = prompt("Please enter saving throws", "+1/+1/+1");
               if(saveThrows!=null){
                  createNewChar(name, url, health, saveThrows);
               }
            }

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
   text: "Save Map",
   show: false,
   fnc: function(butt) {
      clickedOnButton = true;
      var name = prompt("Name the file:", "");
      if(name!=null){
         var toSave = {
            dd: "map",
            x1s: [],
            x2s: [],
            y1s: [],
            y2s: [],
            characters: []
         };
         for(var i = 0; i<walls.length; i++){
            toSave.x1s.push(walls[i].x1);
            toSave.y1s.push(walls[i].y1);
            toSave.x2s.push(walls[i].x2);
            toSave.y2s.push(walls[i].y2);
         }
         toSave.characters = characters;
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
   text: "Drop To Upload",
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
var username;
var statsFont;

function preload() {
   loadFonts();
   setupSocket();
   getChars();
   setupCoolors();
}

function loadFonts(){
   // statsFont = loadFont('assets/Hero Light.otf');
   statsFont = loadFont('assets/Rediviva.ttf');
}

function createNewChar(name, imgURL, maxH, saveThrows){
   var fn = prompt("Please enter filename");
   if(fn!=null){
      var toSave = {
         dd: "character",
         showStats: true,
         url: imgURL,
         name,
         maxHealth: maxH,
         saveThrows
      };
      var blob = new Blob([JSON.stringify(toSave)], {type: "text/plain;charset=utf-8"});
      saveAs(blob, fn+'.txt');
   }
   if(findInDict(imgURL)===-1){
      var img = loadImage(imgURL, (img) => {
         characterImgDict.push({
            key: imgURL,
            value: img
         });
         characters.push({
            posX : 0,
            posY: 0,
            showStats: true,
            url: imgURL,
            name,
            maxHealth: maxH,
            saveThrows
         });
         updateServerChars();
         redrawAll();
      });
   }else{
      var img = characterImgDict[findInDict(imgURL)].value;
      characters.push({
         posX : 0,
         posY: 0,
         showStats: true,
         url: imgURL,
         name,
         maxHealth: maxH,
         saveThrows
      });
      updateServerChars();
      redrawAll();

   }
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
   setupRollTab();
   getMap();
   redrawAll();
   setupUsername();
}

function setupUsername(){
   var val = getCookieValue("username");
   if(val!=null){
      console.log(val);
   }else{
      var un = prompt("Please enter your username: ", "");
      if(un!=null){
         // username = un;
         document.cookie = `username=${un}`;
         // console.log(getCookieValue("username"));
      }
   }
}

function getCookieValue(a) {
    var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
}

function setupRollTab(){
   var w = windowWidth;
   var h = windowHeight;

   rollButton = createButton(rollTab.textAct);
   rollButton.position(w*(1-rollTab.buttonWidthP-rollTab.offBufferW), h*(1-rollTab.buttonHeightP-rollTab.offBufferH));
   rollButton.size(rollTab.buttonWidthP*w, rollTab.buttonHeightP*h);
   rollButton.style('background-color', coolors.white);
   rollButton.style('outline', 'none');
   rollButton.style('border', '2px solid ' + coolors.mar);
   rollButton.mousePressed(rollTab.toggleRollTab);

   rollInp = createInput('1d20');
   rollInp.position(w*(1-rollTab.widthP*(1-rollTab.inpWidthC)-rollTab.inpWidthP/2-rollTab.offBufferW), h*(1-rollTab.heightP*(1-rollTab.inpHeightC)-rollTab.offBufferH-rollTab.inpHeightP/2));
   rollInp.size(rollTab.inpWidthP*w, rollTab.inpHeightP*h);
   rollInp.mousePressed(() => {
      clickedOnButton = true;
   });
   rollInp.hide();
}

function checkRollInput(){
   if(rollTab.showTab){
      document.activeElement.blur();
      rolledVal = rollDice(rollInp.value());
      redrawAll();
   }
}

function rollDice(s){
   var sum = 0;
   s.split("+").forEach(st => {
      sum += rollOneTypeDie(st);
   });
   //TODO notify others of roll
   return sum;
}

function rollOneTypeDie(s){
   var cleanS = "";
   for(i = 0; i<s.length; i++){
      if(s[i]!==" "){
         cleanS += s[i];
      }
   }
   return roll(parseInt(cleanS.substring(0, cleanS.lastIndexOf("d"))), parseInt(cleanS. substring(cleanS.lastIndexOf("d")+1, cleanS.length)));
}

function roll(a, s){
   var res = 0;
   for(i = 0; i<a; i++){
      var rolled = int(random(s))+1;
      res += rolled;
   }
   return res;
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
   var w = windowWidth;
   var h = windowHeight;
   buttonProps.forEach(bp => {
      var button = createButton(bp.text);
      // button.position(bp.posX, bp.posY);
      // button.size(bp.width, bp.height);
      button.position(menuProps.bufferW*w, menuProps.heightStartP*h+buttons.length*(menuProps.buttonHeightP+menuProps.bufferH)*h+menuProps.bufferH*h);
      button.size(menuProps.buttonWidthP*w, menuProps.buttonHeightP*h);

      bp.myButton = button;
      button.style('background-color', coolors.white);
      button.style('outline', 'none');
      button.style('border', '2px solid ' + coolors.black);
      button.mousePressed(function () {bp.fnc(button);});
      (bp.show) ? button.show() : button.hide();
      buttons.push(button);
   });
   buttons[buttons.length-1].drop(uploadFile);


}

function uploadFile(file){ //for uploading maps or characters
   if(file.type==='text'){
      var rec = JSON.parse(file.data);
      if(rec.dd === "map"){
         var newmap = [];
         for(var i = 0; i<rec.x1s.length; i++){
            newmap.push({
               x1: rec.x1s[i],
               y1: rec.y1s[i],
               x2: rec.x2s[i],
               y2: rec.y2s[i]
            });
         }
         characters = rec.characters;
         walls = newmap;
         updateServerWalls();
         updateServerChars();
      }else if(rec.dd === "character"){
         if(findInDict(rec.url)===-1){
            var img = loadImage(rec.url, (img) => {
               characterImgDict.push({
                  key: rec.url,
                  value: img
               });
               characters.push({
                  posX : 0,
                  posY: 0,
                  showStats: rec.showStats,
                  url: rec.url,
                  name: rec.name,
                  maxHealth: rec.maxHealth,
                  saveThrows: rec.saveThrows
               });
               updateServerChars();
               redrawAll();
            });
         }else{
            var img = characterImgDict[findInDict(rec.url)].value;
            characters.push({
               posX : 0,
               posY: 0,
               showStats: rec.showStats,
               url: rec.url,
               name: rec.name,
               maxHealth: rec.maxHealth,
               saveThrows: rec.saveThrows
            });
            updateServerChars();
            redrawAll();
         }
      }
   }
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
   strokeWeight( menuProps.STW );
   stroke(coolors.black);
   fill(coolors.rasp);
   var w = windowWidth;
   var h = windowHeight;
   if(showMenuButton.showMenu){
      rect(
         0,
         menuProps.heightStartP*h,
         (menuProps.buttonWidthP+menuProps.bufferW*2)*w,
         (buttons.length*menuProps.buttonHeightP+(buttons.length+1)*menuProps.bufferH)*h);
   }else{
      rect(
         0,
         menuProps.heightStartP*h,
         (menuProps.buttonWidthP+menuProps.bufferW*2)*w,
         (menuProps.buttonHeightP+menuProps.bufferH*2)*h);
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

function drawStats(){
   if(hiLi.isHigh){
      if(selectedChar.showStats){
         strokeWeight(2);
         stroke(coolors.mar);
         fill(coolors.purp);
         var w = windowWidth;
         var h = windowHeight;
         rect(w-statsProps.widthP*w, 0, statsProps.widthP*w, statsProps.heightP*h);
         fill(coolors.white);
         noStroke();
         textSize(h*statsProps.heightP*statsProps.lineHeight);
         // textAlign(CENTER);
         textFont(statsFont);
         textAlign(LEFT);
         text("Name: ", w*(1-(1-statsProps.bufferW)*statsProps.widthP), (statsProps.heightP*(1-2*statsProps.bufferH)*h)/statsProps.lines);
         textAlign(RIGHT);
         text(selectedChar.name, w*(1-statsProps.bufferW*statsProps.widthP), (statsProps.heightP*(1-2*statsProps.bufferH)*h)/statsProps.lines);
         textAlign(LEFT);
         text("Max health: ", w*(1-(1-statsProps.bufferW)*statsProps.widthP), 2*(statsProps.heightP*(1-2*statsProps.bufferH)*h)/statsProps.lines);
         textAlign(RIGHT);
         text(selectedChar.maxHealth, w*(1-statsProps.bufferW*statsProps.widthP), 2*(statsProps.heightP*(1-2*statsProps.bufferH)*h)/statsProps.lines);
         textAlign(LEFT);
         text("Saves: ", w*(1-(1-statsProps.bufferW)*statsProps.widthP), 3*(statsProps.heightP*(1-2*statsProps.bufferH)*h)/statsProps.lines);
         textAlign(RIGHT);
         text(selectedChar.saveThrows, w*(1-statsProps.bufferW*statsProps.widthP), 3*(statsProps.heightP*(1-2*statsProps.bufferH)*h)/statsProps.lines);
         strokeWeight(1);
      }
   }
}

function drawRoll(){
   if(rollTab.showTab){
      strokeWeight(3);
      stroke(coolors.purp);
      fill(coolors.mar);
      var w = windowWidth;
      var h = windowHeight;
      rect((1-rollTab.widthP-rollTab.offBufferW)*w, (1-rollTab.heightP-rollTab.offBufferH)*h, (rollTab.widthP+rollTab.offBufferW)*w, (rollTab.heightP+rollTab.offBufferH)*h);
      strokeWeight(1);
      textSize(rollTab.heightP*windowHeight*rollTab.textHeight);
      fill(coolors.white);
      textFont(statsFont);
      textAlign(LEFT);
      text("Rolled: " + rolledVal, (1-(1-rollTab.textBufferL)*rollTab.widthP-rollTab.offBufferW)*windowWidth, (1-rollTab.heightP*rollTab.textBufferD-rollTab.offBufferH)*windowHeight);
   }else{
      strokeWeight(3);
      stroke(coolors.purp);
      fill(coolors.mar);
      var w = windowWidth;
      var h = windowHeight;
      rect((1-2*rollTab.offBufferW-rollTab.buttonWidthP)*w, (1-2*rollTab.offBufferH-rollTab.buttonHeightP)*h, (2*rollTab.offBufferW+rollTab.buttonWidthP)*w, (2*rollTab.offBufferH+rollTab.buttonHeightP)*h);
      strokeWeight(1);
   }
}

function redrawAll() {
   clear();
   background( coolors.white );
   drawGrid();
   drawWalls();
   drawHiLi();
   drawChars();
   drawStats();
   drawRoll();
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
      if(hiLi.isHigh && hiLi.posX === gx && hiLi.posY === gy){
         hiLi.isHigh = false;
      }else{
         hiLi.posX = gx;
         hiLi.posY = gy;
         characters.forEach(character => {
            if(hiLi.posX == character.posX && hiLi.posY == character.posY) {
               selectedChar = character;
            }
         });
         hiLi.isHigh = true;
      }
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
         if(!rollTab.showTab){
            gridSpacing += zoomSpeed;
         }
         break;
      case 189: // -
         if(!rollTab.showTab){
            gridSpacing > zoomSpeed ? gridSpacing -= zoomSpeed : null;
         }
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
      case ENTER:
         checkRollInput();
         break;
      default:
         break;
   }
   redrawAll();
}

function mouseWheel(event) {
   if(event.delta>0){
      gridSpacing += zoomSpeed;
   }else{
      gridSpacing > zoomSpeed ? gridSpacing -= zoomSpeed : null;
   }
   redrawAll();
}
