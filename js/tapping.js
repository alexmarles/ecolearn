define(function (require) {
  var pointer         = require("pointer"),
      timer           = require("timer"),
      constants       = require("constants"),
      canvas          = require("canvas"),
      Item            = require("item"),
      Bubble          = require("bubble"),
      Button          = require("button"),
      Tapping         = {};

  Tapping = function () {
    this.page         = 0;
    this.next         = new Button(canvas.width-105, canvas.height-55, 100, 50, "rgba(50, 50, 255, 1)", "Següent");
    this.background   = new Image;
    this.pauseBtn     = new Button(165, 4, 30, 30, "rgba(50, 50, 255, 1)", "||");
    this.resumeBtn    = new Button(110, 100, 140, 100, "rgba(50, 50, 255, 1)", "Tornar al joc");
    this.timePause    = 0;
    this.exit         = false;
    this.exitBtn      = new Button(110, 210, 140, 100, "rgba(255, 50, 50, 1)", "Sortir");
    this.inGame       = 0;
    this.bubbles      = [];
    this.totalScore   = 0;
    this.items        = [];
    this.itemData     = {
                          images: {},
                          sizes: {
                            item0: constants.itemWidth,
                            item1: constants.itemWidth,
                            item2: constants.itemWidth,
                          }
                        };
  };

  Tapping.prototype.init = function (canvas) {
    var that = this;

    this.background.src = "images/tap_bg.png";

    loadImages({
        item0: "images/bottle.png",
        item1: "images/can.png",
        item2: "images/paper.png",
    }, function (loadedImages) {
      that.itemData.images = loadedImages;
    });
  };

  // ------------------------------
  // FUNCTIONS
  // ------------------------------
  Tapping.prototype.addNewItem = function () {
    var item = new Item(canvas, random(3), 0, this.itemData);

    item.y = random(canvas.height - item.width) + 40;
    item.born = timer.time;
    this.items.push(item);
  };

  Tapping.prototype.handleCollisions = function () {
    var that = this,
        toRemove = null;

    if (pointer.active) {
      this.items.forEach(function(item) {
        if (collides(item, pointer)) {
          pointer.active = false;
          that.totalScore += constants.hit;
          that.bubbles.push(new Bubble(true, item, "+"+constants.hit));
          toRemove = that.items.indexOf(item);
        }
      });
    }
    if (toRemove != null) {
      this.items.splice(toRemove,1);
    }
    toRemove = null;
  };
  
  // UPDATE game objects
  Tapping.prototype.update = function (modifier) {+constants.hit
    var that = this,
        toRemove = null;

    if (!this.pause) {
      if (this.inGame === 0) {
        if (pointer.active && collides(this.next, pointer)) {
          ++this.page;
        }
      } else if (this.inGame === 1) {
        if ((timer.time - timer.lastBorn) > (constants.frequency - 0.02*timer.time)) {
          this.addNewItem();
          timer.lastBorn = timer.time;
        }

        this.handleCollisions();

        this.items.forEach( function(item) {
          if(timer.time - item.born >= 5) {
            toRemove = that.items.indexOf(item);
            that.totalScore -= constants.miss;
            that.bubbles.push(new Bubble(false, item, "-"+constants.miss));
            if (that.totalScore < 0) {
              that.totalScore = 0;
            }
          }
          item.rotation += 100 * modifier;
        });
        if (toRemove != null) {
          this.items.splice(toRemove,1);
        }
        toRemove = null;

        this.bubbles.forEach( function(bubble) {
          if(timer.time - bubble.born >= 2) {
            toRemove = that.bubbles.indexOf(bubble);
          }
        });
        if (toRemove != null) {
          this.bubbles.splice(toRemove,1);
        }
        toRemove = null;

        if (timer.time > 61) {
          this.inGame = 2;
        }
      }
    }

    if (!this.pause) {
      if (pointer.active && collides(this.pauseBtn, pointer)) {
        this.pause = true;
        this.timePause = timer.time;
      }
    } else {
      if (pointer.active && collides(this.resumeBtn, pointer)) {
        this.pause = false;
        timer.time = this.timePause;
        this.timePause = 0;
      }

      if (pointer.active && collides(this.exitBtn, pointer)) {
        this.exit = true;
      }
    }

    return !this.exit;
  };

  // RENDER game objects
  Tapping.prototype.render = function(canvas, ctx) {

    ctx.fillStyle = "rgba(100, 200, 255, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (this.inGame === 0) {
      switch (this.page) {
        case 0:
          ctx.globalAlpha = 0.25;
          ctx.drawImage(this.background, 0, 0, canvas.width, canvas.height);
          ctx.globalAlpha = 1;

          this.next.render(ctx);
          break;
        default:
          ++this.inGame;
          break;
      }
    } else if (this.inGame === 1) {
      ctx.drawImage(this.background, 0, 0, canvas.width, canvas.height);

      ctx.shadowColor = 'black';
      ctx.shadowBlur = 1;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      if (!this.pause) {
        this.items.forEach( function(item) {
          ctx.globalAlpha = 1 - (0.2*(timer.time - item.born));
          item.rotate(ctx);
        });
        ctx.globalAlpha = 1;
      }

      ctx.shadowColor = "white";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      this.bubbles.forEach( function(bubble) {
        bubble.render();
      });

      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.fillRect(0, 0, canvas.width, 40);

      ctx.font = "24px Helvetica";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillStyle = "black";
      ctx.fillText("PUNTS: " + this.totalScore, 5, 5);
      ctx.textAlign = "right";
      if (this.pause) {
        ctx.fillText("TEMPS: " + parseInt(this.timePause), 355, 5);
      } else {
        ctx.fillText("TEMPS: " + parseInt(timer.time), 355, 5);
      }

      this.pauseBtn.render(ctx);
      
      if (this.pause) {
        ctx.globalAlpha = 1;
        this.resumeBtn.render(ctx);
        this.exitBtn.render(ctx);
        ctx.globalAlpha = 0.25;
      } else {
        ctx.globalAlpha = 1;
      }
    } else {
      ctx.globalAlpha = 0.25;
      ctx.drawImage(this.background, 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;

      ctx.font = "20px Helvetica";
      ctx.textAlign = "center";
      ctx.fillStyle = "black";
      ctx.fillText("HAS FET UNA PUNTUACIÓ DE...", 180, 150);
      ctx.fillText("FELICITATS!", 180, 280);
      ctx.fillText("TORNA A JUGAR SI VOLS", 180, 330);
      ctx.fillText("MILLORAR LA TEVA PUNTUACIÓ", 180, 350);
      ctx.font = "24px Helvetica";
      ctx.fillStyle = "blue";
      ctx.fillText(this.totalScore + " PUNTS!", 180, 220);

      this.exitBtn = new Button(80, 400, 200, 100, "rgba(255, 50, 50, 1)", "Tornar al menú");
      this.exitBtn.render(ctx);
    }
  };

  return Tapping;

});
