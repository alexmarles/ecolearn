define(function (require) {

  var pointer         = require("pointer"),
      timer           = require("timer"),
      constants       = require("constants"),
      canvas          = require("canvas"),
      Container       = require("container"),
      Item            = require("item"),
      Bubble          = require("bubble"),
      Button          = require("button");
      Classification  = {};

  Classification = function () {
    this.page         = 0;
    this.next         = new Button(canvas.width-105, canvas.height-55, 100, 50, "rgba(50, 50, 255, 1)", "Següent");
    this.background   = new Image;
    this.scoreBg      = new Image;
    this.exit         = false;
    this.exitBtn      = new Button(165, 4, 30, 30, "rgba(255, 50, 50, 1)", "X");
    this.inGame       = 0;
    this.bubbles      = [];
    this.totalScore   = 0;
    this.hasObject    = false;
    this.containers   = [new Container(0), new Container(1), new Container(2)];
    this.items        = [];
    this.itemsToMove  = [];
    this.itemData     = {
                          images: {},
                          sizes: {
                            item0: constants.itemWidth,
                            item1: constants.itemWidth,
                            item2: constants.itemWidth,
                            item3: constants.itemWidth,
                            item4: constants.itemWidth,
                            item5: constants.itemWidth
                          }
                        };
  };

  Classification.prototype.init = function (canvas) {

    var that = this;

    this.background.src = "images/clas_bg.png";
    this.scoreBg.src = "images/clas_bg_score.png";

    loadImages({
        item0: "images/tetra.png",
        item1: "images/box.png",
        item2: "images/bottle.png",
        item3: "images/can.png",
        item4: "images/paper.png",
        item5: "images/jar.png"
    }, function (loadedImages) {
      that.itemData.images = loadedImages;
    });

    this.containers.forEach( function (container) {
      container.init(canvas);
    });
    
  };

  // HANDLE COLLISIONS FOR GAME OBJECTS
  Classification.prototype.handleCollisions = function (canvas) {
    var that = this,
        value = 0,
        toRemove = null;

    if (pointer.active) {
      this.items.forEach(function(item) {
        if (collides(item, pointer) && !that.hasObject) {
          item.picked = true;
          that.hasObject = true;
        }
      });
    }

    this.items.forEach(function(item) {
      that.containers.forEach(function(container) {
        if (collides(item, container)) {
          if (item.type === container.type) {
            that.totalScore += 50;
            that.bubbles.push(new Bubble(true, item, "+50"));
            ++container.hits;
          } else {
            that.totalScore -= 100;
            that.bubbles.push(new Bubble(false, item, "-100"));
            ++container.misses;
            if (that.totalScore < 0) {
              that.totalScore = 0;
            }
          }
          toRemove = that.items.indexOf(item);
        }
      });
    });
    if (toRemove != null) {
      this.items.splice(toRemove,1);
    }
    toRemove = null;
  };

  // Update game objects
  Classification.prototype.update = function (modifier) {
    var that = this,
        next = false,
        toRemove = null;

    if (this.inGame === 0) {
      if (pointer.active && collides(this.next, pointer)) {
        ++this.page;
      }
    } else if (this.inGame === 1) {
      if (pointer.active) {

        this.itemsToMove.forEach(function(iTM) {
          iTM.x = pointer.x-(iTM.width/2);
          iTM.y = pointer.y-(iTM.height/2);
        });
      } else {
        this.hasObject = false;
        this.items.forEach(function(item) {
          item.picked = false;
        });
      }

      if ((timer.time - timer.lastBorn) > (constants.frequency - 0.02*timer.time)) {
        this.items.push(new Item(canvas, random(6), constants.speed, this.itemData));
        timer.lastBorn = timer.time;
      }

      this.handleCollisions(canvas);
      this.itemsToMove = [];
      this.items.forEach( function(item) {
        if (item.picked) {
          that.itemsToMove.push(item);
          item.speed = 0;
        } else {
          item.speed = constants.speed;
        }
        item.y += item.speed * modifier;
        if (!item.picked) {
          item.rotation += 50 * modifier;
        }
      });

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
    if (pointer.active && collides(this.exitBtn, pointer)) {
      this.exit = true;
    }

    return !this.exit;
  };

  // RENDER game objects
  Classification.prototype.render = function(canvas, ctx) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (this.inGame === 0) {
      switch (this.page) {
        case 0:
          ctx.globalAlpha = 0.25;
          ctx.drawImage(this.scoreBg, 0, 0, canvas.width, canvas.height);
          ctx.globalAlpha = 1;

          this.next.render(ctx);
          break;
        default:
          ++this.inGame;
          break;
      }
    } else if (this.inGame === 1) {
      ctx.drawImage(this.background, 0, 0, canvas.width, canvas.height);

      ctx.shadowColor = "black";
      ctx.shadowBlur = 1;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      this.items.forEach( function(item) {
        item.rotate(ctx);
      });

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
      ctx.drawImage(this.scoreBg, 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;

      ctx.font = "20px Helvetica";
      ctx.textAlign = "center";
      ctx.fillStyle = "black";
      ctx.fillText("HAS FET UNA PUNTUACIÓ DE...", 180, 150);
      ctx.fillText("TORNA A JUGAR SI VOLS", 180, 280);
      ctx.fillText("MILLORAR LA TEVA PUNTUACIÓ", 180, 330);
      ctx.font = "24px Helvetica";
      ctx.fillStyle = "blue";
      ctx.fillText(this.totalScore + " PUNTS!", 180, 220);

      this.exitBtn = new Button(80, 400, 200, 100, "rgba(255, 50, 50, 1)", "Tornar al menú");
      this.exitBtn.render(ctx);
    }
  };

  return Classification;

});
