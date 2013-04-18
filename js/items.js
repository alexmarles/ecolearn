function Item(canvas, type, speed, data) {
  this.canvas = canvas;
  this.data = data;
  this.changeType(type);
  this.x = random(this.canvas.width - this.width);
  this.y = this.height;

  this.picked = false;
  this.born = 0;
  this.speed = speed;
  this.rotation = 0;
};

Item.prototype.changeType = function(type) {
  this.type = type;
  this.image = this.data.images["poke" + this.type];

  var ratio = this.image.width / this.image.height;
  this.image.width = this.data.sizes["poke" + this.type];
  this.image.height = this.data.sizes["poke" + this.type] / ratio;

  this.width = this.image.width;
  this.height = this.image.height;
  this.rotation += 10;
};

Item.prototype.rotate = function(ctx) {
  if (this.image !== undefined) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.translate(this.width / 2, this.height / 2);
    ctx.rotate(this.rotation * (Math.PI / 180));
    ctx.translate(-this.width / 2, -this.height / 2);
    ctx.drawImage(this.image, 0, 0, this.width, this.height);
    ctx.restore();
  }
};

var items = [];
