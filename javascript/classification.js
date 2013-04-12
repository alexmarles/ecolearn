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
  var itemSpeed = 150;
  var itemWidth = 40;
  var itemHeight = 40;

  var containerWidth = 75;
  var containerHeight = 35;

  var frequency = 2;
  var speed = 50;

  // ------------------------------
  // CLASSES
  // ------------------------------

  function Item() {
    this.x = parseInt(Math.random() * (canvas.width - itemWidth));
    this.y = itemHeight;
    this.type = parseInt(Math.random() * 3);
    this.width = itemWidth;
    this.height = itemHeight;
    this.image = new Image();
    this.image.src = "images/poke"+this.type+".png";
    this.picked = false;
    this.speed = 50;
    this.rotation = 0;
  }

  Item.prototype.rotate = function() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.translate(this.width / 2, this.height / 2);
    ctx.rotate(this.rotation * (Math.PI / 180));
    ctx.translate(-this.width / 2, -this.height / 2);
    ctx.drawImage(this.image, 0, 0, this.width, this.height);
    ctx.restore();
  };

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
  var timer = {
    time: 0,
    lastWave: 0
  }

  var pointer = {
    x: 0,
    y: 0,
    width: 1,
    height: 1
  };


  var items = [];
  var itemsToMove = [];

  var containers = [new Container(0), new Container(1), new Container(2)];

  // ------------------------------
  // VARIABLES
  // ------------------------------

  var totalScore = 0;
  var pointerActive = false;
  var hasObject = false;

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

  // Check collision
  var collides = function (a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
  };

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
      if ((item.y+itemHeight) >= canvas.height) {
        items.splice(items.indexOf(item),1);
        totalScore -= 100;
      }
    });
  };

  // Sets random position and type for an item
  var initializeItem = function (item) {
      item.x = parseInt(Math.random() * (canvas.width - itemHeight*2) + itemHeight);
      item.y = itemHeight;
      item.type = parseInt(Math.random() * 3);
  };

  // Update game objects
  var update = function (modifier) {
    if (timer.time - timer.lastWave > frequency) {
      items.push(new Item());
      timer.lastWave = timer.time;
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
        item.rotation += 100 * modifier;
      }
    });
  };
 
  var render = function () {
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.shadowColor = 'black';
    ctx.shadowBlur = 1;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    items.forEach( function(item) {
      if (navigator.isCocoonJS) {
        ctx.beginPath();
        ctx.arc(item.x+(item.width/2)+1, item.y+(item.height/2)+1, item.height/2, 0, 2*Math.PI);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fill(),
        ctx.stroke();
      }
      item.rotate();
    });
    
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.fillRect(containers[0].x, containers[0].y-itemHeight, containers[0].width, containers[0].height+itemHeight);
    ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
    ctx.fillRect(containers[1].x, containers[1].y-itemHeight, containers[1].width, containers[1].height+itemHeight);
    ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
    ctx.fillRect(containers[2].x, containers[2].y-itemHeight, containers[2].width, containers[2].height+itemHeight);

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

  items.forEach( function(item) {
    initializeItem(item);
  });

  containers[0].x = (canvas.width/6)*1 - (containerWidth/2);
  containers[0].y = canvas.height - (containerHeight + 10);
  containers[1].x = (canvas.width/6)*3 - (containerWidth/2);
  containers[1].y = canvas.height - (containerHeight + 10);
  containers[2].x = (canvas.width/6)*5 - (containerWidth/2);
  containers[2].y = canvas.height - (containerHeight + 10);

  var then = Date.now();
  loop();
}
