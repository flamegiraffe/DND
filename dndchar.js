class dndchar{
   constructor(image, posX, posY){
      this.mimage = image;
      this.mposX = posX;
      this.mposY = posY;
   }
   getImage(){
      return this.mimage;
   }
   getPosX(){
      return this.mposX;
   }
   getPosY(){
      return this.mposY;
   }
   setX(x){
      this.mposX = x;
   }
   setY(y){
      this.mposY = y;
   }
}
