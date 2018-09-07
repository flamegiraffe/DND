var cnv;
var lobby1 = {
   text: "Bol lobby",
   posX: 25,
   posY: 25,
   width: 100,
   height: 25,
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
   text: "Create new lobby",
   posX: 25,
   posY: 500,
   width: 200,
   height: 50,
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
var buttonProps = [lobby1, newLobby];
var buttons = [];

function setupLobbies(){
   jQuery.post("/makelobby", {lobby: "bol", pass: "sap"}, (data, status) => {
      // console.log(data);
      if(data.status===200){
         console.log("successfully registered bolsap");
      }
   });
}
function preload(){
   setupCoolors();
   setupLobbies();
}
function setupButtons(){
   buttonProps.forEach(bp => {
      var button = createButton(bp.text);
      button.position((windowWidth-bp.width)/2, bp.posY);
      button.size(bp.width, bp.height);
      button.style('background-color', coolors.white);
      button.style('outline', 'none');
      button.style('border', '2px solid ' + coolors.rasp);
      button.mousePressed(function () {bp.fcn();});
      buttons.push(button);
   });
}
function setup(){
   cnv = createCanvas(windowWidth, windowHeight);
   setupButtons();
   redrawAll();
}
function redrawAll(){
   clear();
   background(coolors.white);
   // checkHover();
   // drawButtons();
}
// function drawButtons(){
//    for(var i=0; i<buttonProps.length; i++){
//       var b = buttonProps[i];
//       stroke(coolors.gray);
//       fill(coolors.dblue);
//       rect(b.posX, b.posY, b.width, b.height);
//       // rect(b.posX, b.posY, b.size, b.size);
//    }
// }
// function checkHover(){
//    for(var i=0; i<buttonProps.length; i++){
//       var x = mouseX;
//       var y = mouseY;
//       var b = buttonProps[i];
//       if(x>b.posX && x<b.posX+b.size && y>b.posY && y<b.posY+b.size){
//          b.isHovered = true;
//       }else{
//          b.isHovered = false;
//       }
//    }
// }

function draw(){
   var x = (windowWidth - width) / 2;
   var y = (windowHeight - height) / 2;
   cnv.position(x, y);
}
// function mousePressed() {
//    for(var i=0; i<buttonProps.length; i++){
//       var x = mouseX;
//       var y = mouseY;
//       var b = buttonProps[i];
//       if(x>b.posX && x<b.posX+b.width && y>b.posY && y<b.posY+b.height){
//          buttonProps[i].fcn();
//          // document.location.href = b.toPage;
//       }
//    }
// }
