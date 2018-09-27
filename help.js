var cnv;

function setup(){
   cnv = createCanvas( window.innerWidth, window.innerHeight );
   rect(100,100,100,100);
}
function draw(){
   var x = (window.innerWidth - width) / 2;
   var y = (window.innerHeight - height) / 2;
   cnv.position(x, y);
}
