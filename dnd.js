var cnv;
var zoom = 10;
var gridSpacing = 50;
var zoomSpeed = 1;
var xOff = 0;
var yOff = 0;
var white;
var black;
var gray;
var hX, hY;
var isHigh;
var barbImg;

var characters = [];

function preload(){
   barbImg = loadImage('assets/barbarian.png');
}

function setup() {
   print("changed");

   setupColors();
   setupChars();
   cnv = createCanvas(windowWidth, windowHeight);
   redrawAll();
}

function setupChars(){
   var barb = new dndchar(barbImg, 10, 5);
   characters.push(barb);
}

function setupColors(){
   white = color(245, 240, 246);
   black = color(28, 29, 32);
   gray = color(220, 220, 220);
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
   for(var i=0; i<characters.length; i++){
      image(characters[i].getImage(), (characters[i].getPosX()+xOff)*gridSpacing, (characters[i].getPosY()+yOff)*gridSpacing, gridSpacing, gridSpacing);
   }
}
function redrawAll(){
   clear();
   background(white);
   drawGrid();
   drawChars();
}
function mousePressed(){
   var gx = Math.floor(mouseX/gridSpacing)-xOff;
   var gy = Math.floor(mouseY/gridSpacing)-yOff;
   for(var i=0; i<characters.length; i++){
      if(gx == characters[i].getPosX() && gy == characters[i].getPosY()){
         // isHigh = true;
      }
   }
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
