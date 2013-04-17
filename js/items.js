function Item(canvas, speed) {
  this.type = parseInt(Math.random() * 3);
  this.image = loadImage("images/poke"+this.type+".png");
  this.width = this.image.naturalWidth;
  this.height = this.image.naturalHeight;
  this.x = parseInt(Math.random() * (canvas.width - this.width));
  this.y = this.height;
  this.picked = false;
  this.speed = speed;
  this.rotation = 0;
};

Item.prototype.rotate = function(ctx) {
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.translate(this.width / 2, this.height / 2);
  ctx.rotate(this.rotation * (Math.PI / 180));
  ctx.translate(-this.width / 2, -this.height / 2);
  ctx.drawImage(this.image, 0, 0, this.width, this.height);
  ctx.restore();
};

var items = [];
