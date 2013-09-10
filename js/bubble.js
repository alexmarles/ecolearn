// ------------------------------
// BUBBLE
// ------------------------------

define(function (require) {
  var constants       = require("constants"),
      canvas          = require("canvas"),
      timer           = require("timer"),
      ScoreBubble     = {};

  Bubble = function (good, item, score) {
    this.x = item.x;
    this.y = item.y;
    this.good = good;
    this.radius = constants.bubbleRadius;
    this.score = score;
    this.born = timer.time;
  };

  Bubble.prototype.render = function() {
    var centerX = this.x + this.radius,
        centerY = this.y + this.radius,
        ctx = canvas.getContext("2d");

    centerX -= 0.5*(timer.time - this.born);
    ctx.globalAlpha = 1 - (0.5*(timer.time - this.born));

    ctx.beginPath();
    ctx.arc(centerX, centerY, this.radius, 0, 2 * Math.PI, false);
    if (this.good) {
      ctx.fillStyle = "green";
    } else {
      ctx.fillStyle = "red";
    }
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.font = "12px Chalkduster";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText(this.score, centerX, centerY-6);

    ctx.globalAlpha = 1;
  };

  return Bubble;

});
