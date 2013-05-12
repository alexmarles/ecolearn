function main() {

  // Creating canvas
  var canvas = document.createElement(navigator.isCocoonJS ? 'screencanvas' : 'canvas');
  canvas.id = 'game';
  document.body.appendChild(canvas);
  var ctx = canvas.getContext("2d");
  canvas.width = 360;
  canvas.height = 640;

  // ------------------------------
  // CONSTANTS
  // ------------------------------
  var itemWidth = 40;
  var containerWidth = 75;
  var containerHeight = 35;

  var frequency = 2;
  var speed = 50;

  // ------------------------------
  // CLASSES
  // ------------------------------

  function Container(type) {
    this.x = 0;
    this.y = 0;
    this.type = type;
    this.width = containerWidth;
    this.height = containerHeight;
    this.hits = 0;
    this.misses = 0;
  }

  // ------------------------------
  // OBJECTS
  // ------------------------------
  var pointer = {
    x: 0,
    y: 0,
    width: 1,
    height: 1
  };

  // ------------------------------
  // VARIABLES
  // ------------------------------

  var totalScore = 0;
  var pointerActive = false;
  var hasObject = false;

  var itemsToMove = [];
  var containers = [new Container(0), new Container(1), new Container(2)];
  var itemData = {
    images: {},
    sizes: {
      item0: itemWidth,
      item1: itemWidth,
      item2: itemWidth,
      item3: itemWidth,
      item4: itemWidth
    }
  };

  // ------------------------------
  // CONTROLS
  // ------------------------------

  // Mouse controls
  var getMousePos = function (e) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      width: 1,
      height: 1
    };
  };

  addEventListener("mousedown", function (e) {
    pointerActive = true;
    pointer = getMousePos(e);
  }, false);

  addEventListener("mouseup", function (e) {
    pointerActive = false;
    hasObject = false;
    items.forEach(function(item) {
      item.picked = false;
    });
  }, false);
  
  addEventListener("mousemove", function (e) {
    if (pointerActive) {
      pointer = getMousePos(e);
      itemsToMove.forEach(function(iTM) {
        iTM.x = pointer.x-(iTM.width/2);
        iTM.y = pointer.y-(iTM.height/2);
      });
    }
  }, false);

  // Touch controls
  var getTouchPos = function (e) {
    return {
      x: e.targetTouches[0].pageX,
      y: e.targetTouches[0].pageY,
      width: 1,
      height: 1
    };
  };

  addEventListener("touchstart", function (e) {
    pointerActive = true;
    pointer = getTouchPos(e);
  }, false);

  addEventListener("touchend", function (e) {
    pointerActive = false;
    hasObject = false;
    items.forEach(function(item) {
      item.picked = false;
    });
  }, false);

  addEventListener("touchmove", function (e) {
    if (pointerActive) {
      pointer = getTouchPos(e);
      itemsToMove.forEach(function(iTM) {
        iTM.x = pointer.x-(iTM.width/2);
        iTM.y = pointer.y-(iTM.height/2);
      });
    }
  }, false);

  // ------------------------------
  // FUNCTIONS
  // ------------------------------

  var handleCollisions = function () {
    if (pointerActive) {
      items.forEach(function(item) {
        if (collides(item, pointer) && !hasObject) {
          item.picked = true;
          hasObject = true;
        }
      });
    }

    items.forEach(function(item) {
      containers.forEach(function(container) {
        if (collides(item, container)) {
          if (item.type === container.type) {
            totalScore += 50;
            ++container.hits;
          } else {
            totalScore -= 100;
            ++container.misses;
            if (totalScore < 0) {
              totalScore = 0;
            }
          }
          items.splice(items.indexOf(item),1);
        }
      });
      if ((item.y+item.height) >= canvas.height) {
        items.splice(items.indexOf(item),1);
        totalScore -= 100;
      }
    });
  };

  // Update game objects
  var update = function (modifier) {
    if (timer.time - timer.lastBorn > frequency) {
      items.push(new Item(canvas, random(5), speed, itemData));
      timer.lastBorn = timer.time;
    }
    handleCollisions();
    itemsToMove = [];
    items.forEach( function(item) {
      if (item.picked) {
        itemsToMove.push(item);
        item.speed = 0;
      } else {
        item.speed = speed;
      }
      item.y += item.speed * modifier;
      if (!item.picked) {
        item.rotation += 50 * modifier;
      }
    });
  };
 
  // RENDER game objects
  var render = function () {
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.shadowColor = 'black';
    ctx.shadowBlur = 1;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    items.forEach( function(item) {
      item.rotate(ctx);
    });
    
    ctx.fillStyle = "rgba(255, 255, 0, 0.5)";
    ctx.fillRect(containers[0].x, containers[0].y-containerHeight, containers[0].width, containers[0].height+containerHeight);
    ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
    ctx.fillRect(containers[1].x, containers[1].y-containerHeight, containers[1].width, containers[1].height+containerHeight);
    ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
    ctx.fillRect(containers[2].x, containers[2].y-containerHeight, containers[2].width, containers[2].height+containerHeight);

    ctx.shadowColor = 'white';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillText("SCORE: " + totalScore, 5, 5);
    ctx.textAlign = "right";
    ctx.fillText("TIME: " + parseInt(timer.time), 355, 5);
  };

  // Request Animation Frame for loop
  var requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    function( callback ){
      window.setTimeout(callback, 1000 / 60);
    };
  })();

  // Loop
  var loop = function () {
    var now = Date.now();
    var delta = now - then;
    timer.time += (delta/1000);

    update(delta/1000);
    render();

    then = now;

    requestAnimFrame(loop);
  };

  containers[0].x = (canvas.width/6)*1 - (containerWidth/2);
  containers[0].y = canvas.height - (containerHeight + 10);
  containers[1].x = (canvas.width/6)*3 - (containerWidth/2);
  containers[1].y = canvas.height - (containerHeight + 10);
  containers[2].x = (canvas.width/6)*5 - (containerWidth/2);
  containers[2].y = canvas.height - (containerHeight + 10);

  var then = Date.now();
  loadImages({
      item0: "images/tetra.png",
      item1: "images/box.png",
      item2: "images/bottle.png",
      item3: "images/can.png",
      item4: "images/paper.png"
  }, function (loadedImages) {
    itemData.images = loadedImages;
    loop();
  });
}
