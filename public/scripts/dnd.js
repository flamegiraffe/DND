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

var characters = [];
var coolors = {};

function preload() {
   barbImg = loadImage( 'assets/barbarian.png' );
   coolors.white = color(245, 240, 246);
   coolors.black = color(28, 29, 32);
   coolors.gray = color(220, 220, 220);
   coolors.blue = color(42, 183, 202);
   coolors.dblue = color(0, 72, 124);
}

function setup() {
   setupChars();
   cnv = createCanvas( windowWidth, windowHeight );
   redrawAll();
}

function setupChars() {
   const BARB_INIT_POS_X = 10;
   const BARB_INIT_POS_Y = 5;
   var barb = new DndChar(barbImg, BARB_INIT_POS_X, BARB_INIT_POS_Y);
   characters.push( barb.properties() );
}

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
   characters.forEach(character => {
      image(character.image,
            (character.posX + xOff) * gridSpacing,
            (character.posY + yOff) * gridSpacing,
            gridSpacing,
            gridSpacing);
   });
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

function redrawAll() {
   clear();
   background( coolors.white );
   drawGrid();
   drawHiLi();
   drawChars();
}

function mousePressed() {
   var gx = Math.floor(mouseX / gridSpacing) - xOff;
   var gy = Math.floor(mouseY / gridSpacing) - yOff;
   var clickedOnChar = false;
   characters.forEach(character => {
      if( gx == character.posX && gy == character.posY )
         clickedOnChar = true;
   });
   if( clickedOnChar ) {
      hiLi.posX = gx;
      hiLi.posY = gy;
      hiLi.isHigh = true;
   } else {
      characters.forEach(character => {
         if(hiLi.posX == character.posX && hiLi.posY == character.posY) {
            hiLi.isHigh = false;
            character.posX = gx;
            character.posY = gy;
         }
      });
   }
   redrawAll();
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
