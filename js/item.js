// ------------------------------
// ITEM
// ------------------------------

define(function (require) {
      Item = {};

  Item = function (canvas, type, speed, data) {
    this.canvas = canvas;
    this.data = data;
    this.changeType(type);
    this.x = random(this.canvas.width - this.width);
    this.y = this.height;

    this.picked = false;
    this.speed = speed;
    this.rotation = 0;
  };

  Item.prototype.changeType = function(type) {
    if (type > 2)
      this.type = type - 3;
    else
      this.type = type;
    this.image = this.data.images["item" + type];

    console.log(this.image);
    var ratio = this.image.width / this.image.height;
    this.image.width = this.data.sizes["item" + type];
    this.image.height = this.data.sizes["item" + type] / ratio;

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

  return Item;

});
