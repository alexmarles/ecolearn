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
    this.background   = new Image;
    this.exit         = false;
    this.exitBtn      = new Button(165, 3, 30, 30, "rgba(255, 50, 50, 1)", "X");
    this.inGame       = true;
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
          that.totalScore += 50;
          that.bubbles.push(new Bubble(true, item, "+50"));
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
  Tapping.prototype.update = function (modifier) {
    var that = this,
        toRemove = null;

    if (this.inGame) {
      if (timer.time - timer.lastBorn > constants.frequency) {
        this.addNewItem();
        timer.lastBorn = timer.time;
      }

      this.handleCollisions();

      this.items.forEach( function(item) {
        if(timer.time - item.born >= 5) {
          toRemove = that.items.indexOf(item);
          that.totalScore -= 100;
          that.bubbles.push(new Bubble(false, item, "-100"));
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
        this.inGame = false;
      }
    }

    if (pointer.active && collides(this.exitBtn, pointer)) {
      this.exit = true;
    }

    return !this.exit;
  };

  // RENDER game objects
  Tapping.prototype.render = function(canvas, ctx) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (this.inGame) {
      ctx.globalAlpha = 0.80;
      ctx.drawImage(this.background, 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;

      ctx.shadowColor = 'black';
      ctx.shadowBlur = 1;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      this.items.forEach( function(item) {
        ctx.globalAlpha = 1 - (0.2*(timer.time - item.born));
        item.rotate(ctx);
      });
      ctx.globalAlpha = 1;

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
      ctx.fillText("TEMPS: " + parseInt(timer.time), 355, 5);

      this.exitBtn.render(ctx);
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
