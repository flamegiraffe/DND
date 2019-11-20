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
var placeCharClick = false;
var charToPlace;
var spaceIsDown = false;
var dragStartX = 0;
var dragStartY = 0;
var xOffStart = 0;
var yOffStart = 0;


var building = {
   wallStarted: false,
   firstCornerX: 0,
   firstCornerY: 0,
   wallWidth: 4
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
   lines: 3,
   removeWidth: 0.1,
   removeHeight: 0.05
};
var rollTab = {
   showTab: false,
   widthP: 0.25,
   heightP: 0.15,
   textAct: "Roll",
   textDeact: "Hide",
   buttonWidthP: 0.05,
   textHeight: 0.4,
   buttonHeightP: 0.05,
   inpWidthP: 0.15,
   inpHeightP: 0.05,
   inpWidthC: 0.5,
   inpHeightC: 0.25,
   textBufferL: 0.1,
   textBufferD: 0.1,
   offBufferW: 0.01,
   offBufferH: 0.01,
   toggleRollTab: function() {
      clickedOnButton = true;
      if (rollTab.showTab) {
         rollButton.html(rollTab.textAct);
         rollInp.hide();
      } else {
         rollButton.html(rollTab.textDeact);
         rollInp.show();
      }
      rollTab.showTab = !rollTab.showTab;
      redrawAll();
   }
};
var mlogProps = {
   showLog: false,
   text: "Show Log",
   logFont: statsFont,
   buttonWidthP: 0.05,
   buttonHeightP: 0.05,
   buttonBufferW: 0.01,
   buttonBufferH: 0.01,
   widthP: 0.3,
   heightP: 0.15,
   textBufferH: 0.1,
   textBufferW: 0.05,
   lines: 4,
   backDiv: null,
   lineElts: [],
   toggleLog: function() {
      clickedOnButton = true;
      mlogProps.showLog = !mlogProps.showLog;
      redrawAll();
   }
};

var rolledVal = "";
var rollButton;
var rollInp;

var logEntries = [];
var logButton;

var showMenuButton = {
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
      if (this.showMenu) {
         butt.style('background-color', coolors.orange);
      } else {
         editButton.editWalls = false;
         buttons.forEach(b => {
            b.style('background-color', coolors.white);
         });
      }

      buttons.forEach(b => {
         this.showMenu ? b.show() : (b !== butt ? b.hide() : b.show());
      });
      redrawAll();
   }
};
var editButton = {
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
      if (this.editWalls) {
         for (var i = 1; i < buttons.length; i++) {
            buttons[i].style('background-color', coolors.white);
         }
         butt.style('background-color', coolors.orange);
         doorButton.editDoors = false;
         cursor(CROSS);
         // this.firstClick = true;
      } else {
         butt.style('background-color', coolors.white);
         building.wallStarted = false;
         cursor(ARROW);
      }
   }
};
var doorButton = {
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
      if (this.editDoors) {
         cursor(CROSS);
         for (var i = 1; i < buttons.length; i++) {
            buttons[i].style('background-color', coolors.white);
         }
         butt.style('background-color', coolors.orange);
         editButton.editWalls = false;
         butt.style('background-color', coolors.orange)
         // this.firstClick = true;
      } else {
         cursor(ARROW);
         butt.style('background-color', coolors.white);
         building.wallStarted = false;
      }
   }
};
var addCharButton = {
   waitingOnClick: false,
   posX: 10,
   posY: 200,
   width: 50,
   height: 30,
   text: "Create Character",
   show: false,
   fnc: function(butt) {
      clickedOnButton = true;
      swal({
            text: "Please enter character's name:",
            content: {
               element: "input",
               attributes: {
                  placeholder: "Gandalf",
               }
            }
         })
         .then((name) => {
            if (name != null) {
               swal({
                     text: "Please enter image url:",
                     content: {
                        element: "input",
                        attributes: {
                           placeholder: "https://data.whicdn.com/images/48395905/original.jpg",
                        }
                     }
                  })
                  .then(url => {
                     if (url != null) {
                        swal({
                              text: "Please enter maximum health:",
                              content: {
                                 element: "input",
                                 attributes: {
                                    placeholder: "14",
                                 }
                              }
                           })
                           .then(health => {
                              if (health != null) {
                                 swal({
                                       text: "Please enter saving throws:",
                                       content: {
                                          element: "input",
                                          attributes: {
                                             placeholder: "+1/+1/+1",
                                          }
                                       }
                                    })
                                    .then(saves => {
                                       if (saves != null) {
                                          createNewChar(name, url, health, saveThrows);
                                       }
                                    });
                              }
                           });
                     }
                  });
            }
         });
      // var name = prompt("Please enter character's name: ", "Robert Baratheon");
      // if(name!=null){
      //    var url = prompt("Please enter image url", "");
      //    if(url!=null){
      //       var health = prompt("Please enter maximum health: ", "50");
      //       if(health!=null){
      //          var saveThrows = prompt("Please enter saving throws", "+1/+1/+1");
      //          if(saveThrows!=null){
      // createNewChar(name, url, health, saveThrows);
      //          }
      //       }
      //
      //    }
      // }
   }
};
var downloadMap = {
   waitingOnClick: false,
   posX: 10,
   posY: 250,
   width: 50,
   height: 30,
   text: "Save Map",
   show: false,
   fnc: function(butt) {
      clickedOnButton = true;
      // var name = prompt("Name the file:", "");
      swal({
            text: "Name the file:",
            content: {
               element: "input",
               attributes: {
                  placeholder: "Underdark Entrance",
               }
            }
         })
         .then(name => {
            if (name != null) {
               var toSave = {
                  dd: "map",
                  x1s: [],
                  x2s: [],
                  y1s: [],
                  y2s: [],
                  x1ds: [],
                  x2ds: [],
                  y1ds: [],
                  y2ds: [],
                  characters: []
               };
               for (var i = 0; i < walls.length; i++) {
                  toSave.x1s.push(walls[i].x1);
                  toSave.y1s.push(walls[i].y1);
                  toSave.x2s.push(walls[i].x2);
                  toSave.y2s.push(walls[i].y2);
               }
               for (var i = 0; i < doors.length; i++) {
                  toSave.x1ds.push(doors[i].x1);
                  toSave.y1ds.push(doors[i].y1);
                  toSave.x2ds.push(doors[i].x2);
                  toSave.y2ds.push(doors[i].y2);
               }
               toSave.characters = characters;
               var blob = new Blob([JSON.stringify(toSave)], {
                  type: "text/plain;charset=utf-8"
               });
               saveAs(blob, name + '.txt');
            }
         });
   }
};
var uploadMap = {
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

var myHexC = document.location.href.substring(document.location.href.lastIndexOf("/") + 1, );
var username;
var hero;
var statsFont;
// var removeImg;
var removeButton;

//------------------------------------------------------------------------------------------------------------
//                               FUNCTIONS                                                                    |
//------------------------------------------------------------------------------------------------------------

function preload() {
   loadFonts();
   setupSocket();
   getChars();
   setupCoolors();
}

function loadFonts() {
   // statsFont = loadFont('assets/Hero Light.otf');
   statsFont = loadFont('assets/Kingthings Foundation.ttf');
   hero = loadFont('assets/Hero Light.otf');
   mlogProps.logFont = hero;
}

function createNewChar(name, imgURL, maxH, saveThrows) {
   // var fn = prompt("Please enter filename");
   swal({
         text: "Please enter filename:",
         content: {
            element: "input",
            attributes: {
               placeholder: "Gandalf",
            }
         }
      })
      .then(fn => {
         if (fn != null) {
            var toSave = {
               dd: "character",
               showStats: true,
               url: imgURL,
               name,
               maxHealth: maxH,
               saveThrows
            };
            var blob = new Blob([JSON.stringify(toSave)], {
               type: "text/plain;charset=utf-8"
            });
            saveAs(blob, fn + '.txt');
         }
         placeCharClick = true;
         cursor(CROSS);
         if (findInDict(imgURL) === -1) {
            var img = loadImage(imgURL, (img) => {
               characterImgDict.push({
                  key: imgURL,
                  value: img
               });
               charToPlace = {
                  posX: 0,
                  posY: 0,
                  showStats: true,
                  url: imgURL,
                  name,
                  maxHealth: maxH,
                  saveThrows
               };
               // characters.push({
               //    posX : 0,
               //    posY: 0,
               //    showStats: true,
               //    url: imgURL,
               //    name,
               //    maxHealth: maxH,
               //    saveThrows
               // });
               // updateServerChars();
               // redrawAll();
            });
         } else {
            var img = characterImgDict[findInDict(imgURL)].value;
            charToPlace = {
               posX: 0,
               posY: 0,
               showStats: true,
               url: imgURL,
               name,
               maxHealth: maxH,
               saveThrows
            };
            // characters.push({
            //    posX : 0,
            //    posY: 0,
            //    showStats: true,
            //    url: imgURL,
            //    name,
            //    maxHealth: maxH,
            //    saveThrows
            // });
            // updateServerChars();
            // redrawAll();
         }
      });
}

function findInDict(url) {
   for (var i = 0; i < characterImgDict.length; i++) {
      if (characterImgDict[i].key === url) {
         return i;
      }
   }
   return -1;
}

function loadCharImages() {
   for (var i = 0; i < characters.length; i++) {
      if (findInDict(characters[i].url) === -1) {
         var img = loadImage(characters[i].url, (img, i) => {
            console.log("finished loading image");
            redrawAll();
         });
         characterImgDict.push({
            key: characters[i].url,
            value: img
         });
      }
   }
}

function getChars() {
   // var myHexC = document.location.href.substring(document.location.href.lastIndexOf("/")+1, );
   var toSend = {
      request: "getChars",
      hexC: myHexC
   };
   socketSend(toSend);
}

function setup() {
   cnv = createCanvas(window.innerWidth, window.innerHeight);
   setupButtons();
   setupRollTab();
   setupLog();
   redrawAll();
   setupUsername(); //then notify join
}

function notifyJoin() {
   var toSend = {
      request: "join",
      hexC: myHexC,
      user: username,
   };
   socketSend(toSend);
}

function setupLog() {
   var w = window.innerWidth;
   var h = window.innerHeight;

   logButton = createButton(mlogProps.text);
   logButton.position(w * mlogProps.buttonBufferW, h * (1 - mlogProps.buttonBufferH - mlogProps.buttonHeightP));
   logButton.size(mlogProps.buttonWidthP * w, mlogProps.buttonHeightP * h);
   logButton.id('log');
   logButton.mousePressed(mlogProps.toggleLog);
   mlogProps.backDiv = createDiv('');
   mlogProps.backDiv.id('logBack');
   mlogProps.backDiv.position(0, (1 - 2 * mlogProps.buttonBufferH - mlogProps.buttonHeightP) * h);
   mlogProps.backDiv.size(w * (2 * mlogProps.buttonBufferW + mlogProps.buttonWidthP), h * (2 * mlogProps.buttonBufferH + mlogProps.buttonHeightP));
   // logButton.parent(mlogProps.backDiv);
   // $(".logLine").css('padding-top', (mlogProps.textBufferH*h) + 'px');
   // $(".logLine").css('padding-bottom', (mlogProps.textBufferH*h) + 'px');
   for (var i = 0; i < mlogProps.lines; i++) {
      logEntries.push("");
      mlogProps.lineElts.push(createElement('p', ''));
      mlogProps.lineElts[i].addClass("logLine");
      // mlogProps.lineElts[i].style('height', h * (1-2 * mlogProps.textBufferH) * mlogProps.heightP / mlogProps.lines + 'px');
      mlogProps.lineElts[i].addClass("hide");
      mlogProps.lineElts[i].position(w * (mlogProps.buttonBufferW + mlogProps.buttonWidthP + mlogProps.widthP * mlogProps.textBufferW), h * (1 - mlogProps.textBufferH * mlogProps.heightP - (mlogProps.lines - i) * (1 - 2 * mlogProps.textBufferH) * mlogProps.heightP / mlogProps.lines));
      mlogProps.lineElts[i].size(w*mlogProps.widthP, h * (1-2 * mlogProps.textBufferH) * mlogProps.heightP / mlogProps.lines);
   }
}

function setupUsername() {
   var val = getCookieValue("username");
   if (val != "") {
      console.log(val);
      username = val;
      notifyJoin();
   } else {
      // var un = prompt("Please enter your username: ", "");
      swal({
            text: "Please enter your username:",
            content: {
               element: "input",
               attributes: {
                  placeholder: "Boblin",
               }
            }
         })
         .then(un => {
            if (un != null) {
               username = un;
               document.cookie = `username=${un}`;
               // console.log(getCookieValue("username"));
            }
         })
         .then(()=>{
            notifyJoin();
         });
   }
}

function getCookieValue(a) {
   var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
   return b ? b.pop() : '';
}

function setupRollTab() {
   var w = window.innerWidth;
   var h = window.innerHeight;

   rollButton = createButton(rollTab.textAct);
   rollButton.position(w * (1 - rollTab.buttonWidthP - rollTab.offBufferW), h * (1 - rollTab.buttonHeightP - rollTab.offBufferH));
   rollButton.size(rollTab.buttonWidthP * w, rollTab.buttonHeightP * h);
   rollButton.id('roll');
   rollButton.mousePressed(rollTab.toggleRollTab);

   rollInp = createInput('1d20');
   rollInp.position(w * (1 - rollTab.widthP * (1 - rollTab.inpWidthC) - rollTab.inpWidthP / 2 - rollTab.offBufferW), h * (1 - rollTab.heightP * (1 - rollTab.inpHeightC) - rollTab.offBufferH - rollTab.inpHeightP / 2));
   rollInp.size(rollTab.inpWidthP * w, rollTab.inpHeightP * h);
   rollInp.id('rollInp');
   rollInp.mousePressed(() => {
      clickedOnButton = true;
   });
   rollInp.hide();
}

function checkRollInput() {
   if (rollTab.showTab) {
      document.activeElement.blur();
      rolledVal = rollDice(rollInp.value());
      redrawAll();
   }
}

function rollDice(s) {
   var res = {
      sum: 0,
      rolls: []
   };
   s.split("+").forEach(st => {
      if (st.includes("d")) {
         var rolled = rollOneTypeDie(st);
         res.sum += rolled.sum;
         rolled.rolls.forEach(r => {
            res.rolls.push(r);
         });
      } else {
         res.sum += parseInt(st);
      }
   });
   sendRoll(res);
   return res.sum;
}

function sendRoll(res) {
   var toSend = {
      request: "roll",
      hexC: myHexC,
      user: username,
      rolls: res.rolls
   };
   socketSend(toSend);
}

function sendNameChange(name1, name2) {
   var toSend = {
      request: "name",
      hexC: myHexC,
      name1,
      name2
   };
   socketSend(toSend);
}

function rollOneTypeDie(s) {
   var cleanS = "";
   for (i = 0; i < s.length; i++) {
      if (s[i] !== " ") {
         cleanS += s[i];
      }
   }
   return roll(parseInt(cleanS.substring(0, cleanS.lastIndexOf("d"))), parseInt(cleanS.substring(cleanS.lastIndexOf("d") + 1, cleanS.length)));
}

function roll(a, s) {
   // var res = 0;
   var res = {
      sum: 0,
      rolls: []
   };
   for (i = 0; i < a; i++) {
      var rolled = int(random(s)) + 1;
      res.sum += rolled;
      res.rolls.push(rolled);
   }
   return res;
}

function getDoors() {
   var toSend = {
      request: "getDoors",
      hexC: myHexC
   };
   socketSend(toSend);
}

function getMap() {
   // var myHexC = document.location.href.substring(document.location.href.lastIndexOf("/")+1, );
   var toSend = {
      request: "getMap",
      hexC: myHexC
   };
   socketSend(toSend);
}

function onServerMessage(msg) {
   console.log("on server message", msg.request);
   if (msg.status === "success") {
      if (msg.request === "getMap") {
         walls = msg.map;
         redrawAll();
      } else if (msg.request === "getDoors") {
         doors = msg.doors;
         redrawAll();
      } else if (msg.request === "updateWalls") {
         walls = msg.map;
         redrawAll();
      } else if (msg.request === "updateDoors") {
         doors = msg.doors;
         redrawAll();
      } else if (msg.request === "updateChars") {
         characters = msg.characters;
         console.log("from server chars: ", msg.characters);
         loadCharImages();
         redrawAll();
      } else if (msg.request === "getChars") {
         characters = msg.characters;
         loadCharImages();
         redrawAll();
      } else if (msg.request === "roll") {
         myLog(msg);
      } else if (msg.request === "join") {
         myLog(msg);
         getMap();
         getDoors();
         redrawAll();
      } else if (msg.request === "name") {
         myLog(msg);
      } else if (msg.request === "leave") {
         myLog(msg);
      }
   }
}

function myLog(msg) {
   for (var i = 0; i < mlogProps.lines - 1; i++) {
      logEntries[i] = logEntries[i + 1];
   }
   var newEntry = "";
   if (msg.request === "roll") {
      newEntry = msg.user + " rolled " + prettyPrint(msg.rolls);
   } else if (msg.request === "join") {
      newEntry = msg.user + " joined the lobby";
   } else if (msg.request === "name") {
      newEntry = msg.name1 + " changed name to " + msg.name2;
   } else if (msg.request === "leave") {
      newEntry = msg.user + " left the lobby";
   }
   logEntries[mlogProps.lines - 1] = newEntry;
   redrawAll();
}

function prettyPrint(arr) {
   var res = "";
   for (var i = 0; i < arr.length - 1; i++) {
      res += arr[i] + ", ";
   }
   res += arr[arr.length - 1];
   return res;
}

function updateServerWalls() {
   // var myHexC = document.location.href.substring(document.location.href.lastIndexOf("/")+1, );
   var toSend = {
      request: "updateWalls",
      hexC: myHexC,
      walls
   };
   socketSend(toSend);
}

function updateServerDoors() {
   var toSend = {
      request: "updateDoors",
      hexC: myHexC,
      doors
   };
   socketSend(toSend);
}

function updateServerChars() {
   // var myHexC = document.location.href.substring(document.location.href.lastIndexOf("/")+1, );
   var toSend = {
      request: "updateChars",
      hexC: myHexC,
      characters
   };
   socketSend(toSend);
}

function setupButtons() {
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
      button.position(menuProps.bufferW * w, menuProps.heightStartP * h + buttons.length * (menuProps.buttonHeightP + menuProps.bufferH) * h + menuProps.bufferH * h);
      button.size(menuProps.buttonWidthP * w, menuProps.buttonHeightP * h);
      // bp.myButton = button;
      button.class('menubutton');
      button.mousePressed(function() {
         bp.fnc(button);
      });
      (bp.show) ? button.show(): button.hide();
      buttons.push(button);
   });
   buttons[buttons.length - 1].drop(uploadFile);

   var nb = createButton("Change name");
   nb.position(menuProps.bufferW * w * 3 + menuProps.buttonWidthP * w, menuProps.heightStartP * h + menuProps.bufferH * h);
   nb.size(menuProps.buttonWidthP * w, menuProps.buttonHeightP * h);
   // bp.myButton = button;
   nb.class('menubutton');
   nb.mousePressed(changeUsername);
   nb.hide();
   buttons.push(nb);

   var hb = createButton("Help");
   hb.position(menuProps.bufferW * w * 3 + menuProps.buttonWidthP * w, menuProps.heightStartP * h + 2 * menuProps.bufferH * h + menuProps.buttonHeightP * h);
   hb.size(menuProps.buttonWidthP * w, menuProps.buttonHeightP * h);
   // bp.myButton = button;
   hb.class('menubutton');
   hb.mousePressed(help);
   hb.hide();
   buttons.push(hb);

   removeButton = createButton("Remove");
   removeButton.position(w * (1 - statsProps.removeWidth / 2 - statsProps.widthP / 2), (statsProps.heightP - statsProps.removeHeight / 2) * h);
   removeButton.size(statsProps.removeWidth * w, statsProps.removeHeight * h);
   removeButton.mousePressed(removeChar);
   removeButton.id('remove');
   removeButton.hide();
}

function help() {
   document.location.href = "/help";
}

function changeUsername() {
   var val = getCookieValue("username");
   // var un = prompt("Please enter your username: ", "");
   swal({
         text: "Please enter your username:",
         content: {
            element: "input",
            attributes: {
               placeholder: "Boblin",
            }
         }
      })
      .then(un => {
         if (un != null) {
            username = un;
            document.cookie = `username=${un}`;
            sendNameChange(val, un);
         }
      });
}

function removeChar() {
   hiLi.isHigh = false;
   characters.splice(characters.lastIndexOf(selectedChar), 1);
   updateServerChars();
   redrawAll();
}

function uploadFile(file) { //for uploading maps or characters
   if (file.type === 'text') {
      var rec = JSON.parse(file.data);
      if (rec.dd === "map") {
         var newmap = [];
         for (var i = 0; i < rec.x1s.length; i++) {
            newmap.push({
               x1: rec.x1s[i],
               y1: rec.y1s[i],
               x2: rec.x2s[i],
               y2: rec.y2s[i]
            });
         }
         var newwalls = [];
         for (var i = 0; i < rec.x1ds.length; i++) {
            newwalls.push({
               x1: rec.x1ds[i],
               y1: rec.y1ds[i],
               x2: rec.x2ds[i],
               y2: rec.y2ds[i]
            });
         }
         characters = rec.characters;
         walls = newmap;
         doors = newwalls;
         updateServerWalls();
         updateServerDoors();
         updateServerChars();
      } else if (rec.dd === "character") {
         placeCharClick = true;
         cursor(CROSS);
         if (findInDict(rec.url) === -1) {
            var img = loadImage(rec.url, (img) => {
               characterImgDict.push({
                  key: rec.url,
                  value: img
               });
               redrawAll();
               // characters.push({
               //    posX : 0,
               //    posY: 0,
               //    showStats: rec.showStats,
               //    url: rec.url,
               //    name: rec.name,
               //    maxHealth: rec.maxHealth,
               //    saveThrows: rec.saveThrows
               // });
               // updateServerChars();
               // redrawAll();
            });
            charToPlace = {
               posX: 0,
               posY: 0,
               showStats: rec.showStats,
               url: rec.url,
               name: rec.name,
               maxHealth: rec.maxHealth,
               saveThrows: rec.saveThrows
            }
         } else {
            var img = characterImgDict[findInDict(rec.url)].value;
            charToPlace = {
               posX: 0,
               posY: 0,
               showStats: rec.showStats,
               url: rec.url,
               name: rec.name,
               maxHealth: rec.maxHealth,
               saveThrows: rec.saveThrows
            };
            // characters.push({
            //    posX : 0,
            //    posY: 0,
            //    showStats: rec.showStats,
            //    url: rec.url,
            //    name: rec.name,
            //    maxHealth: rec.maxHealth,
            //    saveThrows: rec.saveThrows
            // });
            // updateServerChars();
            // redrawAll();
         }
         updateServerChars();
      }
   }
}

function draw() {
   var x = (window.innerWidth - width) / 2;
   var y = (window.innerHeight - height) / 2;
   cnv.position(x, y);
}

function drawGrid() {
   stroke(coolors.gray);
   for (var i = 0; i < (window.innerWidth / gridSpacing); i++) {
      line(i * gridSpacing, 0, i * gridSpacing, window.innerHeight);
   }
   for (var i = 0; i < (window.innerHeight / gridSpacing); i++) {
      line(0, i * gridSpacing, window.innerWidth, i * gridSpacing);
   }
}

function drawChars() {
   if (characters.length > 0) {
      characters.forEach(character => {
         var i = findInDict(character.url);
         if (i !== -1) {
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
   if (hiLi.isHigh) {
      stroke(coolors.gold);
      strokeWeight(2);
      // fill( coolors.white );
      noFill();
      rect((hiLi.posX + xOff) * gridSpacing,
         (hiLi.posY + yOff) * gridSpacing,
         gridSpacing,
         gridSpacing);
      strokeWeight(1);
   }
}

function drawMenu() {
   strokeWeight(menuProps.STW);
   stroke(coolors.black);
   fill(coolors.rasp);
   var w = window.innerWidth;
   var h = window.innerHeight;
   if (showMenuButton.showMenu) {
      rect(
         0,
         menuProps.heightStartP * h,
         (menuProps.buttonWidthP + menuProps.bufferW * 2) * w * 2,
         ((6) * menuProps.buttonHeightP + (7) * menuProps.bufferH) * h);
      // rect(
      //    (menuProps.buttonWidthP+menuProps.bufferW*2)*w,
      //    menuProps.heightStartP*h,
      //    (menuProps.buttonWidthP+menuProps.bufferW*2)*w,
      //    ((buttons.length-6)*menuProps.buttonHeightP+(buttons.length-5)*menuProps.bufferH)*h);
   } else {
      rect(
         0,
         menuProps.heightStartP * h,
         (menuProps.buttonWidthP + menuProps.bufferW * 2) * w,
         (menuProps.buttonHeightP + menuProps.bufferH * 2) * h);
   }
   strokeWeight(1);

}

function drawWalls() {
   walls.forEach(d => {
      strokeWeight(building.wallWidth);
      stroke(coolors.black);
      fill(coolors.black);
      line((d.x1 + xOff) * gridSpacing, (d.y1 + yOff) * gridSpacing, (d.x2 + xOff) * gridSpacing, (d.y2 + yOff) * gridSpacing);
      strokeWeight(1);
   });
}

function drawDoors() {
   doors.forEach(w => {
      strokeWeight(building.wallWidth);
      // fill(coolors.black);
      var x1 = (w.x1 + xOff) * gridSpacing;
      var y1 = (w.y1 + yOff) * gridSpacing;
      var x2 = (w.x2 + xOff) * gridSpacing;
      var y2 = (w.y2 + yOff) * gridSpacing;
      var th = 1 / 3;
      var th2 = 2 / 3;
      stroke(coolors.black);
      line((w.x1 + xOff) * gridSpacing, (w.y1 + yOff) * gridSpacing, (w.x2 + xOff) * gridSpacing, (w.y2 + yOff) * gridSpacing);
      stroke(coolors.orange);
      strokeWeight(2 * building.wallWidth);
      line(th2 * x1 + th * x2, th2 * y1 + th * y2, th * x1 + th2 * x2, th * y1 + th2 * y2);
      strokeWeight(1);
   });
}

function drawStats() {
   if (hiLi.isHigh) {
      if (selectedChar.showStats) {
         strokeWeight(2);
         stroke(coolors.blue);
         fill(coolors.ddblue);
         var w = window.innerWidth;
         var h = window.innerHeight;
         rect(w - statsProps.widthP * w, 0, statsProps.widthP * w, statsProps.heightP * h);

         removeButton.show();

         fill(coolors.white);
         noStroke();
         // textSize(h*statsProps.heightP*statsProps.lineHeight);
         // textSize(12);

         textFont(statsFont);
         var tw = statsProps.widthP * w - (1 - 2 * statsProps.bufferW) * statsProps.widthP * w;
         var th = (statsProps.heightP * h - (1 - 2 * statsProps.bufferH) * statsProps.heightP * h) / statsProps.lines;

         textAlign(LEFT);
         textSize(calcFontSize("Name: ", tw / 4, th));
         text("Name: ", w * (1 - (1 - statsProps.bufferW) * statsProps.widthP), (statsProps.heightP * (1 - 2 * statsProps.bufferH) * h) / statsProps.lines);

         textAlign(RIGHT);
         textSize(calcFontSize(selectedChar.name, tw / 2, th));
         text(selectedChar.name, w * (1 - statsProps.bufferW * statsProps.widthP), (statsProps.heightP * (1 - 2 * statsProps.bufferH) * h) / statsProps.lines);

         textAlign(LEFT);
         textSize(calcFontSize("Max health: ", tw / 2, 3 * th / 4));
         text("Max health: ", w * (1 - (1 - statsProps.bufferW) * statsProps.widthP), 2 * (statsProps.heightP * (1 - 2 * statsProps.bufferH) * h) / statsProps.lines);

         textAlign(RIGHT);
         textSize(calcFontSize(selectedChar.maxHealth, tw / 4, 3 * th / 4));
         text(selectedChar.maxHealth, w * (1 - statsProps.bufferW * statsProps.widthP), 2 * (statsProps.heightP * (1 - 2 * statsProps.bufferH) * h) / statsProps.lines);

         textAlign(LEFT);
         textSize(calcFontSize("Saves: ", tw / 3, 3 * th / 4));
         text("Saves: ", w * (1 - (1 - statsProps.bufferW) * statsProps.widthP), 3 * (statsProps.heightP * (1 - 2 * statsProps.bufferH) * h) / statsProps.lines);

         textAlign(RIGHT);
         textSize(calcFontSize(selectedChar.saveThrows, tw / 3, 3 * th / 4));
         text(selectedChar.saveThrows, w * (1 - statsProps.bufferW * statsProps.widthP), 3 * (statsProps.heightP * (1 - 2 * statsProps.bufferH) * h) / statsProps.lines);
         strokeWeight(1);
      }
   } else {
      removeButton.hide();
   }
}

function calcFontSize(str, wd, hg) {
   textSize(12);
   minSizeW = 12 / textWidth(str) * (wd);
   minSizeH = 12 / (textDescent() + textAscent()) * hg;
   ts = min(minSizeW, minSizeH) * 5;
   return ts;
}

function drawRoll() {
   if (rollTab.showTab) {
      strokeWeight(2);
      stroke(coolors.gold);
      fill(coolors.ddblue);
      var w = window.innerWidth;
      var h = window.innerHeight;
      rect((1 - rollTab.widthP - rollTab.offBufferW) * w, (1 - rollTab.heightP - rollTab.offBufferH) * h, (rollTab.widthP + rollTab.offBufferW) * w, (rollTab.heightP + rollTab.offBufferH) * h);
      strokeWeight(1);
      textSize(rollTab.heightP * window.innerHeight * rollTab.textHeight);
      fill(coolors.white);
      noStroke();
      textFont(statsFont);
      textAlign(LEFT);
      text("Rolled: " + rolledVal, (1 - (1 - rollTab.textBufferL) * rollTab.widthP - rollTab.offBufferW) * window.innerWidth, (1 - rollTab.heightP * rollTab.textBufferD - rollTab.offBufferH) * window.innerHeight);
   } else {
      strokeWeight(2);
      stroke(coolors.black);
      fill(coolors.ddblue);
      var w = window.innerWidth;
      var h = window.innerHeight;
      rect((1 - 2 * rollTab.offBufferW - rollTab.buttonWidthP) * w, (1 - 2 * rollTab.offBufferH - rollTab.buttonHeightP) * h, (2 * rollTab.offBufferW + rollTab.buttonWidthP) * w, (2 * rollTab.offBufferH + rollTab.buttonHeightP) * h);
      strokeWeight(1);
   }
}

function drawLog() {
   var w = window.innerWidth;
   var h = window.innerHeight;
   if (mlogProps.showLog) {
      textAlign(LEFT);
      strokeWeight(2);
      // stroke(coolors.gold);
      // fill(coolors.ddblue);
      // rect(0, (1 - mlogProps.buttonBufferH - mlogProps.heightP) * h, w * (mlogProps.buttonBufferW + mlogProps.widthP), h * (mlogProps.buttonBufferH + mlogProps.heightP));
      mlogProps.backDiv.position(0, (1 - mlogProps.buttonBufferH - mlogProps.heightP) * h);
      mlogProps.backDiv.size(w * (mlogProps.buttonBufferW + mlogProps.widthP), h * (mlogProps.buttonBufferH + mlogProps.heightP));
      strokeWeight(1);

      // textFont(mlogProps.logFont);
      textFont(statsFont);
      // textSize(20);
      textSize(((mlogProps.heightP * (1 - mlogProps.textBufferH * 2)) * h) / mlogProps.lines);
      fill(coolors.white);
      noStroke();
      $(".logLine").removeClass("hide");
      for (var i = 0; i < mlogProps.lines; i++) {
         mlogProps.lineElts[i].html(logEntries[i]);
         // text(logEntries[i],
         //    w * (mlogProps.buttonBufferW + mlogProps.buttonWidthP + mlogProps.widthP * mlogProps.textBufferW),
         //    h * (1 - (mlogProps.lines - i) * (1 - 2 * mlogProps.textBufferH) * mlogProps.heightP / mlogProps.lines));
      }
   } else {
      strokeWeight(2);
      mlogProps.backDiv.position(0, (1 - 2 * mlogProps.buttonBufferH - mlogProps.buttonHeightP) * h);
      mlogProps.backDiv.size(w * (2 * mlogProps.buttonBufferW + mlogProps.buttonWidthP), h * (2 * mlogProps.buttonBufferH + mlogProps.buttonHeightP));
      $(".logLine").addClass("hide");
      // stroke(coolors.black);
      // fill(coolors.ddblue);
      // rect(0, (1 - 2 * mlogProps.buttonBufferH - mlogProps.buttonHeightP) * h, w * (2 * mlogProps.buttonBufferW + mlogProps.buttonWidthP), h * (2 * mlogProps.buttonBufferH + mlogProps.buttonHeightP));
      strokeWeight(1);
   }
}

function redrawAll() {
   clear();
   background(coolors.white);
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

function editWallsClick(gx, gy) {
   var gx = Math.round(mouseX / gridSpacing) - xOff;
   var gy = Math.round(mouseY / gridSpacing) - yOff;

   if (!clickedOnButton) {
      if (building.wallStarted) {
         building.wallStarted = false;
         var remove = false;
         if (editButton.editWalls) {
            for (var i = 0; i < walls.length; i++) {
               w = walls[i];
               if ((w.x1 === building.firstCornerX && w.x2 === gx) || (w.x2 === building.firstCornerX && w.x1 === gx)) {
                  if ((w.y1 === building.firstCornerY && w.y2 === gy) || (w.y2 === building.firstCornerY && w.y1 === gy)) {
                     walls.splice(i, 1);
                     remove = true;
                  }
               }
            }
            if (!remove) {
               walls.push({
                  x1: building.firstCornerX,
                  y1: building.firstCornerY,
                  x2: gx,
                  y2: gy
               });
            }
            updateServerWalls();
         } else {
            for (var i = 0; i < doors.length; i++) {
               d = doors[i];
               if ((d.x1 === building.firstCornerX && d.x2 === gx) || (d.x2 === building.firstCornerX && d.x1 === gx)) {
                  if ((d.y1 === building.firstCornerY && d.y2 === gy) || (d.y2 === building.firstCornerY && d.y1 === gy)) {
                     doors.splice(i, 1);
                     remove = true;
                  }
               }
            }
            if (!remove) {
               doors.push({
                  x1: building.firstCornerX,
                  y1: building.firstCornerY,
                  x2: gx,
                  y2: gy
               });
            }
            updateServerDoors();
         }
      } else {
         building.firstCornerX = gx;
         building.firstCornerY = gy;
         building.wallStarted = true;
      }
      // }else{
      //    editButton.firstClick = false;
      // }
   }
}

function playClick(gx, gy) {
   var clickedOnChar = false;
   characters.forEach(character => {
      if (gx == character.posX && gy == character.posY)
         clickedOnChar = true;
   });
   if (clickedOnChar) {
      if (hiLi.isHigh && hiLi.posX === gx && hiLi.posY === gy) {
         hiLi.isHigh = false;
      } else {
         hiLi.posX = gx;
         hiLi.posY = gy;
         characters.forEach(character => {
            if (hiLi.posX == character.posX && hiLi.posY == character.posY) {
               selectedChar = character;
            }
         });
         hiLi.isHigh = true;
      }
   } else {
      if (hiLi.isHigh) {
         selectedChar.posX = gx;
         selectedChar.posY = gy;
         updateServerChars();
         hiLi.isHigh = false;
      }
   }
}

function mousePressed() {
   if (!clickedOnButton) {
      if(spaceIsDown){
         dragStartX = mouseX;
         dragStartY = mouseY;
         xOffStart = xOff;
         yOffStart = yOff;
      }else{
         var gx = Math.floor(mouseX / gridSpacing) - xOff;
         var gy = Math.floor(mouseY / gridSpacing) - yOff;
         if (placeCharClick) {
            placeCharClick = false;
            cursor(ARROW);
            charToPlace.posX = gx;
            charToPlace.posY = gy;
            characters.push(charToPlace);
            updateServerChars();
            redrawAll();
         } else {
            if (editButton.editWalls || doorButton.editDoors) {
               editWallsClick(gx, gy);
            } else {
               playClick(gx, gy);
            }
         }
      }
      redrawAll();
   } else {
      clickedOnButton = false;
   }
}

function keyPressed() {
   switch (keyCode) {
      case 187: // +
         if (!rollTab.showTab) {
            gridSpacing += zoomSpeed;
         }
         break;
      case 189: // -
         if (!rollTab.showTab) {
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
      case 32: // space
         cursor(HAND);
         spaceIsDown = true;
         break;
      default:
         break;
   }
   redrawAll();
}

function keyReleased() {
   switch (keyCode) {
      case 32: //space
         cursor(ARROW);
         spaceIsDown = false;
         break;
   }
}

function mouseWheel(event) {
   if (event.delta > 0) {
      gridSpacing += zoomSpeed;
   } else {
      gridSpacing > 10 ? gridSpacing -= zoomSpeed : null;
   }
   redrawAll();
}

function mouseDragged(){
   if(spaceIsDown){
      var dx = mouseX - dragStartX;
      var dy = mouseY - dragStartY;

      var idx = Math.round(dx/gridSpacing);
      var idy = Math.round(dy/gridSpacing);

      xOff = xOffStart + idx;
      yOff = yOffStart + idy;
      redrawAll();
   }
}

window.addEventListener('beforeunload', function(event) {
   var toSend = {
      request: "leave",
      hexC: myHexC,
      user: username,
   };
   socketSend(toSend);
});
