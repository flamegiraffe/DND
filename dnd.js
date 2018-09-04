var cnv;
var zoom = 10;
var gridSpacing = 50;
var zoomSpeed = 1;
var xOff = 0;
var yOff = 0;
var white, black, gray, blue;
var hX, hY;
var barbImg;
var hiLi = {
   isHigh: false,
   posX: 0,
   posY: 0
};

var characters = [];

function preload(){
   barbImg = loadImage('assets/barbarian.png');
}

function setup() {
   setupColors();
   setupChars();
   cnv = createCanvas(windowWidth, windowHeight);
   redrawAll();
}

function setupChars(){
   // var barb = new dndchar(barbImg, 10, 5);
   // characters.push(barb);
   characters.push({
      image: barbImg,
      posX: 10,
      posY: 5
   });
}

function setupColors(){
   white = color(245, 240, 246);
   black = color(28, 29, 32);
   gray = color(220, 220, 220);
   blue = color(42, 183, 202);
}

function moveGrid(){
   redrawAll();
}

function draw() {
   var x = (windowWidth - width) / 2;
   var y = (windowHeight - height) / 2;
   cnv.position(x, y);
}

function drawGrid(){
   stroke(gray);
   for(var i=0; i<(windowWidth/gridSpacing); i++){
      line(i*gridSpacing, 0, i*gridSpacing, windowHeight);
   }
   for(var i=0; i<(windowHeight/gridSpacing); i++){
      line(0, i*gridSpacing, windowWidth, i*gridSpacing);
   }
}

function drawChars(){
   // for(var i=0; i<characters.length; i++){
   //    image(characters[i].getImage(), (characters[i].getPosX()+xOff)*gridSpacing, (characters[i].getPosY()+yOff)*gridSpacing, gridSpacing, gridSpacing);
   // }
   for(var i=0; i<characters.length; i++){
      image(characters[i].image, (characters[i].posX+xOff)*gridSpacing, (characters[i].posY+yOff)*gridSpacing, gridSpacing, gridSpacing);
   }
}
function drawHiLi(){
   if(hiLi.isHigh){
      stroke(blue);
      strokeWeight(2);
      fill(white);
      rect((hiLi.posX+xOff)*gridSpacing, (hiLi.posY+yOff)*gridSpacing, gridSpacing, gridSpacing);
      strokeWeight(1);
   }
}
function redrawAll(){
   clear();
   background(white);
   drawGrid();
   drawHiLi();
   drawChars();
}
function mousePressed(){
   var gx = Math.floor(mouseX/gridSpacing)-xOff;
   var gy = Math.floor(mouseY/gridSpacing)-yOff;
   var clickedOnChar = false;
   for(var i=0; i<characters.length; i++){
      if(gx == characters[i].posX && gy == characters[i].posY){
         clickedOnChar = true;
         hiLi.posX = gx;
         hiLi.posY = gy;
         hiLi.isHigh = true;
      }
   }
   if(!clickedOnChar){
      for(var i=0; i<characters.length; i++){
         if(hiLi.posX == characters[i].posX && hiLi.posY == characters[i].posY){
            hiLi.isHigh = false;
            characters[i].posX = gx;
            characters[i].posY = gy;
         }
      }
   }
   redrawAll();
}
function keyPressed(){
   print(keyCode);
   if(keyCode==187){ //+
      gridSpacing += zoomSpeed;
      // drawGrid();
   }else if(keyCode == 189){ //-
      if(gridSpacing>zoomSpeed){
         gridSpacing -= zoomSpeed;
         // drawGrid();
      }
   }else if(keyCode == 37){//left
      xOff++;
      // drawChars();
   }else if(keyCode == 39){//right
      xOff--;
      // drawChars();
   }else if(keyCode == 38){//up
      yOff++;
      // drawChars();
   }else if(keyCode == 40){//down
      yOff--;
      // drawChars();
   }
   redrawAll();
}
