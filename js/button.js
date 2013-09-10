define(function (require) {
  var constants = require("constants");

  var Button = function (x, y, width, height, color, text) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.text = text;
  };

  Button.prototype.render = function (ctx) {
    ctx.shadowColor = "black";
    ctx.shadowBlur = 1;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.shadowColor = "white";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    ctx.font = "20px "+constants.font;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.fillText(this.text, this.x+this.width/2, this.y+this.height/2-12);
  };

  return Button;

});
