var cnv;
var toPlay = {
   posX: 25,
   posY: 25,
   width: 100,
   height: 25,
   isHovered: false,
   toPage: "play",
   fcn: function(){
      var inp = prompt("Please enter password", "");
      if (inp != null) {
      // console.log(inp);
         jQuery.post("/checkpass", {lobby: "bol", pass: inp}, (data, status) => {
            // console.log("data:", data);
            if(data.status!==200){
               console.log(data.status);
            }else{
               // console.log("great success");
               document.location.href = "/"+data.hexCode;
            }
         });
      }
   }
};
var newLobby = {
   posX: 25,
   posY: 300,
   width: 200,
   height: 50,
   isHovered: false,
   toPage: "play",
   fcn: function(){
      var lb = prompt("Please enter new lobby name", "");
      if(lb!=null){
         var pw = prompt("Please enter new password", "");
         if(pw!=null){
            jQuery.post("/makelobby", {lobby: lb, pass: pw}, (data, status) => {
               console.log(data);
            });
         }
      }
   }
}
var buttons = [toPlay, newLobby];


function preload(){
   setupCoolors();
}

function setup(){
   cnv = createCanvas(windowWidth, windowHeight);
   redrawAll();
}
function redrawAll(){
   clear();
   background(coolors.white);
   // checkHover();
   drawButtons();
}
function drawButtons(){
   for(var i=0; i<buttons.length; i++){
      var b = buttons[i];
      stroke(coolors.gray);
      fill(coolors.dblue);
      b.posX = (windowWidth-b.width)/2;
      rect(b.posX, b.posY, b.width, b.height);
      // rect(b.posX, b.posY, b.size, b.size);
   }
}
function checkHover(){
   for(var i=0; i<buttons.length; i++){
      var x = mouseX;
      var y = mouseY;
      var b = buttons[i];
      if(x>b.posX && x<b.posX+b.size && y>b.posY && y<b.posY+b.size){
         b.isHovered = true;
      }else{
         b.isHovered = false;
      }
   }
}

function draw(){
   var x = (windowWidth - width) / 2;
   var y = (windowHeight - height) / 2;
   cnv.position(x, y);
}
function mousePressed() {
   for(var i=0; i<buttons.length; i++){
      var x = mouseX;
      var y = mouseY;
      var b = buttons[i];
      if(x>b.posX && x<b.posX+b.width && y>b.posY && y<b.posY+b.height){
         buttons[i].fcn();
         // document.location.href = b.toPage;
      }
   }
}
