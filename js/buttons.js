function Button(x, y, width, height, color, text, fun) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.color = color;
  this.text = text;
  this.fun = fun;
};

Button.prototype.render = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.font = "24px Helvetica";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.fillText(this.text, this.x+this.width/2, this.y+this.height/2-12);

};
