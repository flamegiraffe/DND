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
var doors = [];
var characterImgDict = [];
var selectedChar;
var clickedOnButton = false;

var building ={
   wallStarted: false,
   firstCornerX: 0,
   firstCornerY: 0,
   wallWidth : 4
};
var menuProps = {
   STW: 2,
   buttonWidthP: 0.05,
   buttonHeightP: 0.05,
   heightStartP: 0.0,
   bufferW: 0.01,
   bufferH: 0.01
};
var statsProps = {
   widthP: 0.25,
   heightP: 0.2,
   lineHeight: 0.2,
   bufferW: 0.1,
   bufferH: 0.1,
   lines: 3
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
var mlogProps = {
   showLog:  false,
   text: "Show Log",
   logFont: statsFont,
   buttonWidthP: 0.05,
   buttonHeightP: 0.05,
   buttonBufferW: 0.005,
   buttonBufferH: 0.01,
   widthP: 0.4,
   heightP: 0.15,
   textBufferH: 0.1,
   textBufferW: 0.05,
   lines: 4,
   toggleLog: function() {
      clickedOnButton = true;
      mlogProps.showLog = !mlogProps.showLog;
      redrawAll();
   }
};

var rolledVal ="";
var rollButton;
var rollInp;

var logEntries = [];
var logButton;

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
var doorButton ={
   editDoors: false,
   posX: 10,
   posY: 150,
   width: 50,
   height: 30,
   text: "Edit Doors",
   show: false,
   // firstClick: true,
   fnc: function(butt) {
      clickedOnButton = true;
      this.editDoors = !this.editDoors;
      if(this.editDoors){
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
   text: "Create Character",
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
   text: "Drop Files",
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

var myHexC = document.location.href.substring(document.location.href.lastIndexOf("/")+1, );
var username;
var hero;
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
   hero= loadFont('assets/Hero Light.otf');
   mlogProps.logFont = hero;
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
   cnv = createCanvas( window.innerWidth, window.innerHeight );
   setupButtons();
   setupRollTab();
   setupLog();
   getMap();
   redrawAll();
   setupUsername();
   notifyJoin();
}

function notifyJoin(){
   var toSend = {
      request: "join",
      hexC: myHexC,
      user: username,
   };
   socketSend(toSend);
}

function setupLog(){
   var w = window.innerWidth;
   var h = window.innerHeight;

   logButton = createButton(mlogProps.text);
   logButton.position(w*mlogProps.buttonBufferW, h*(1-mlogProps.buttonBufferH-mlogProps.buttonHeightP));
   logButton.size(mlogProps.buttonWidthP*w, mlogProps.buttonHeightP*h);
   logButton.id('log');
   logButton.mousePressed(mlogProps.toggleLog);

   for(var i = 0; i<mlogProps.lines; i++){
      logEntries.push("");
   }
}

function setupUsername(){
   var val = getCookieValue("username");
   if(val!=""){
      console.log(val);
      username = val;
   }else{
      var un = prompt("Please enter your username: ", "");
      if(un!=null){
         username = un;
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
   var w = window.innerWidth;
   var h = window.innerHeight;

   rollButton = createButton(rollTab.textAct);
   rollButton.position(w*(1-rollTab.buttonWidthP-rollTab.offBufferW), h*(1-rollTab.buttonHeightP-rollTab.offBufferH));
   rollButton.size(rollTab.buttonWidthP*w, rollTab.buttonHeightP*h);
   rollButton.id('roll');
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
   var res = {
      sum: 0,
      rolls: []
   };
   s.split("+").forEach(st => {
      var rolled = rollOneTypeDie(st);
      res.sum += rolled.sum;
      rolled.rolls.forEach(r => {
         res.rolls.push(r);
      });
   });
   sendRoll(res);
   return res.sum;
}

function sendRoll(res){
   var toSend = {
      request: "roll",
      hexC: myHexC,
      user: username,
      rolls: res.rolls
   };
   socketSend(toSend);
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
   // var res = 0;
   var res = {
      sum: 0,
      rolls: []
   };
   for(i = 0; i<a; i++){
      var rolled = int(random(s))+1;
      res.sum += rolled;
      res.rolls.push(rolled);
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
      }else if(msg.request === "updateDoors"){
         doors = msg.doors;
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
      }else if(msg.request === "roll"){
         myLog(msg);
      }else if(msg.request === "join"){
         myLog(msg);
      }
   }
}

function myLog(msg){
   for(var i = 0; i<mlogProps.lines-1; i++){
      logEntries[i] = logEntries[i+1];
   }
   var newEntry = "";
   if(msg.request === "roll"){
      newEntry = msg.user + " rolled " + msg.rolls;
   }else if(msg.request === "join"){
      newEntry = msg.user + " joined the lobby";
   }
   logEntries[mlogProps.lines-1] = newEntry;
   redrawAll();
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

function updateServerDoors(){
   var toSend = {
      request: "updateDoors",
      hexC: myHexC,
      doors
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
   buttonProps.push(doorButton);
   buttonProps.push(addCharButton);
   buttonProps.push(downloadMap);
   buttonProps.push(uploadMap);
   var w = window.innerWidth;
   var h = window.innerHeight;
   buttonProps.forEach(bp => {
      var button = createButton(bp.text);
      // button.position(bp.posX, bp.posY);
      // button.size(bp.width, bp.height);
      button.position(menuProps.bufferW*w, menuProps.heightStartP*h+buttons.length*(menuProps.buttonHeightP+menuProps.bufferH)*h+menuProps.bufferH*h);
      button.size(menuProps.buttonWidthP*w, menuProps.buttonHeightP*h);
      // bp.myButton = button;
      button.class('menubutton');
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
   var x = (window.innerWidth - width) / 2;
   var y = (window.innerHeight - height) / 2;
   cnv.position(x, y);
}

function drawGrid() {
   stroke( coolors.gray );
   for(var i = 0; i < (window.innerWidth / gridSpacing); i++) {
      line(i * gridSpacing, 0, i * gridSpacing, window.innerHeight);
   }
   for(var i = 0; i < (window.innerHeight / gridSpacing); i++) {
      line(0, i * gridSpacing, window.innerWidth, i * gridSpacing);
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
      // fill( coolors.white );
      noFill();
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
   var w = window.innerWidth;
   var h = window.innerHeight;
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
   walls.forEach(d => {
      strokeWeight(building.wallWidth);
      stroke(coolors.black);
      fill(coolors.black);
      line((d.x1+xOff)*gridSpacing, (d.y1+yOff)*gridSpacing, (d.x2+xOff)*gridSpacing, (d.y2+yOff)*gridSpacing);
      strokeWeight(1);
   });
}

function drawDoors(){
   doors.forEach(w => {
      strokeWeight(building.wallWidth);
      // fill(coolors.black);
      var x1 = (w.x1+xOff)*gridSpacing;
      var y1 = (w.y1+yOff)*gridSpacing;
      var x2 = (w.x2+xOff)*gridSpacing;
      var y2 = (w.y2+yOff)*gridSpacing;
      var th = 1/3;
      var th2 = 2/3;
      stroke(coolors.black);
      line((w.x1+xOff)*gridSpacing, (w.y1+yOff)*gridSpacing, (w.x2+xOff)*gridSpacing, (w.y2+yOff)*gridSpacing);
      stroke(coolors.orange);
      strokeWeight(2*building.wallWidth);
      line(th2*x1+th*x2, th2*y1+th*y2, th*x1+th2*x2, th*y1+th2*y2);
      strokeWeight(1);
   });
}

function drawStats(){
   if(hiLi.isHigh){
      if(selectedChar.showStats){
         strokeWeight(2);
         stroke(coolors.mar);
         fill(coolors.purp);
         var w = window.innerWidth;
         var h = window.innerHeight;
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
      var w = window.innerWidth;
      var h = window.innerHeight;
      rect((1-rollTab.widthP-rollTab.offBufferW)*w, (1-rollTab.heightP-rollTab.offBufferH)*h, (rollTab.widthP+rollTab.offBufferW)*w, (rollTab.heightP+rollTab.offBufferH)*h);
      strokeWeight(1);
      textSize(rollTab.heightP*window.innerHeight*rollTab.textHeight);
      fill(coolors.white);
      textFont(statsFont);
      textAlign(LEFT);
      text("Rolled: " + rolledVal, (1-(1-rollTab.textBufferL)*rollTab.widthP-rollTab.offBufferW)*window.innerWidth, (1-rollTab.heightP*rollTab.textBufferD-rollTab.offBufferH)*window.innerHeight);
   }else{
      strokeWeight(3);
      stroke(coolors.purp);
      fill(coolors.mar);
      var w = window.innerWidth;
      var h = window.innerHeight;
      rect((1-2*rollTab.offBufferW-rollTab.buttonWidthP)*w, (1-2*rollTab.offBufferH-rollTab.buttonHeightP)*h, (2*rollTab.offBufferW+rollTab.buttonWidthP)*w, (2*rollTab.offBufferH+rollTab.buttonHeightP)*h);
      strokeWeight(1);
   }
}

function drawLog(){
   var w = window.innerWidth;
   var h = window.innerHeight;
   if(mlogProps.showLog){
      textAlign(LEFT);
      strokeWeight(2);
      stroke(coolors.mar);
      fill(coolors.dblue);
      rect(0, (1-mlogProps.buttonBufferH-mlogProps.heightP)*h, w*(mlogProps.buttonBufferW + mlogProps.widthP), h*(mlogProps.buttonBufferH + mlogProps.heightP));
      strokeWeight(1);

      textFont(mlogProps.logFont);
      // textSize(20);
      textSize(((mlogProps.heightP*(1-mlogProps.textBufferH*2))*h)/mlogProps.lines);
      fill(coolors.white);
      noStroke();
      for(var i = 0; i<mlogProps.lines; i++){
         text(logEntries[i],
              w*(mlogProps.buttonBufferW+mlogProps.buttonWidthP+mlogProps.widthP*mlogProps.textBufferW),
              h*(1-(mlogProps.lines-i)*(1-2*mlogProps.textBufferH)*mlogProps.heightP/mlogProps.lines));
      }
   }else{
      strokeWeight(2);
      stroke(coolors.mar);
      fill(coolors.dblue);
      rect(0, (1-2*mlogProps.buttonBufferH-mlogProps.buttonHeightP)*h, w*(2*mlogProps.buttonBufferW + mlogProps.buttonWidthP), h*(2*mlogProps.buttonBufferH + mlogProps.buttonHeightP));
      strokeWeight(1);
   }
}

function redrawAll() {
   clear();
   background( coolors.white );
   drawGrid();
   drawWalls();
   drawDoors();
   drawHiLi();
   drawChars();
   drawStats();
   drawRoll();
   drawLog();
   drawMenu();
}

function editWallsClick(gx, gy){
   var gx = Math.round(mouseX / gridSpacing) - xOff;
   var gy = Math.round(mouseY / gridSpacing) - yOff;

   if(!clickedOnButton){
      if(building.wallStarted){
         building.wallStarted = false;
         var remove = false;
         if(editButton.editWalls){
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
            for(var i = 0; i<doors.length; i++){
               d = doors[i];
               if((d.x1 === building.firstCornerX && d.x2 === gx) || (d.x2 === building.firstCornerX && d.x1 === gx)){
                  if((d.y1 === building.firstCornerY && d.y2 === gy) || (d.y2 === building.firstCornerY && d.y1 === gy)){
                     doors.splice(i, 1);
                     remove = true;
                  }
               }
            }
            if(!remove){
               doors.push({
                  x1: building.firstCornerX,
                  y1: building.firstCornerY,
                  x2: gx,
                  y2: gy
               });
            }
            updateServerDoors();
         }
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
      if(editButton.editWalls || doorButton.editDoors){
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
