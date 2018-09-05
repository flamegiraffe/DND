class DndChar {
   
   constructor(image, posX, posY) {
      this.image = image;
      this.posX = posX;
      this.posY = posY;
   }
   
   getImage() {
      return this.image;
   }
   
   getPosX() {
      return this.posX;
   }
   
   getPosY() {
      return this.posY;
   }
   
   setX( x ) {
      this.posX = x;
   }
   
   setY( y ) {
      this.posY = y;
   }
   
   properties() {
      return {
         image: this.image,
         posX: this.posX,
         posY: this.posY
      }
   }
   
}