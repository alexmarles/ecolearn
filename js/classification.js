define(function (require) {

  var pointer         = require('pointer'),
      timer           = require('timer'),
      constants       = require('constants'),
      Container       = require('container'),
      Item            = require('item'),
      Classification  = {};

  Classification = function () {
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
                            item4: constants.itemWidth
                          }
                        };
  };

  Classification.prototype.init = function (canvas, ctx) {

    var that = this;

    this.containers.forEach( function (container) {
      container.init(canvas);
    });

    loadImages({
        item0: "images/tetra.png",
        item1: "images/box.png",
        item2: "images/bottle.png",
        item3: "images/can.png",
        item4: "images/paper.png"
    }, function (loadedImages) {
      that.itemData.images = loadedImages;
    });
    
  };

  // ------------------------------
  // FUNCTIONS
  // ------------------------------

  Classification.prototype.handleCollisions = function (canvas) {
    if (pointer.active) {
      this.items.forEach(function(item) {
        if (collides(item, pointer) && !this.hasObject) {
          item.picked = true;
          this.hasObject = true;
        }
      });
    }

    this.items.forEach(function(item) {
      this.containers.forEach(function(container) {
        if (collides(item, container)) {
          if (item.type === container.type) {
            this.totalScore += 50;
            ++container.hits;
          } else {
            this.totalScore -= 100;
            ++container.misses;
            if (this.totalScore < 0) {
              this.totalScore = 0;
            }
          }
          this.items.splice(this.items.indexOf(item),1);
        }
      });
      if ((item.y+item.height) >= canvas.height) {
        this.items.splice(this.items.indexOf(item),1);
        this.totalScore -= 100;
      }
    });
  };

  // Update game objects
  Classification.prototype.update = function (modifier) {
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

    if (timer.time - timer.lastBorn > constants.frequency) {
      this.items.push(new Item(canvas, random(5), constants.speed, this.itemData));
      timer.lastBorn = timer.time;
    }

    this.handleClassificationCollisions();
    this.itemsToMove = [];
    this.items.forEach( function(item) {
      if (item.picked) {
        this.itemsToMove.push(item);
        item.speed = 0;
      } else {
        item.speed = constants.speed;
      }
      item.y += item.speed * modifier;
      if (!item.picked) {
        item.rotation += 50 * modifier;
      }
    });
  };

  // RENDER game objects
  Classification.prototype.render = function(canvas, ctx) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.shadowColor = 'black';
    ctx.shadowBlur = 1;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    this.items.forEach( function(item) {
      item.rotate(ctx);
    });
    
    ctx.fillStyle = "rgba(255, 255, 0, 0.5)";
    ctx.fillRect(this.containers[0].x, this.containers[0].y-containerHeight, this.containers[0].width, this.containers[0].height+containerHeight);
    ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
    ctx.fillRect(this.containers[1].x, this.containers[1].y-containerHeight, this.containers[1].width, this.containers[1].height+containerHeight);
    ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
    ctx.fillRect(this.containers[2].x, this.containers[2].y-containerHeight, this.containers[2].width, this.containers[2].height+containerHeight);

    ctx.shadowColor = 'white';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillText("SCORE: " + this.totalScore, 5, 5);
    ctx.textAlign = "right";
    ctx.fillText("TIME: " + parseInt(timer.time), 355, 5);
  }

  return Classification;

});
