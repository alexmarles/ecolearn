function draw() {

  // Creating canvas
  var canvas = document.getElementById("game");
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

  // ------------------------------
  // OBJECTS
  // ------------------------------
  var pointer = {
    x: 0,
    y: 0,
    width: 1,
    height: 1
  };

  var item0 = {
    speed: itemSpeed,
    type: 0,
    x: 0,
    y: 0,
    width: itemWidth,
    height: itemHeight,
    active: true
  };

  var item1 = {
    speed: itemSpeed,
    type: 0,
    x: 0,
    y: 0,
    width: itemWidth,
    height: itemHeight,
    active: true
  };

  var item2 = {
    speed: itemSpeed,
    type: 0,
    x: 0,
    y: 0,
    width: itemWidth,
    height: itemHeight,
    active: true
  };

  var item3 = {
    speed: itemSpeed,
    type: 0,
    x: 0,
    y: 0,
    width: itemWidth,
    height: itemHeight,
    active: true
  };

  var item4 = {
    speed: itemSpeed,
    type: 0,
    x: 0,
    y: 0,
    width: itemWidth,
    height: itemHeight,
    active: true
  };

  var items = [item0, item1, item2, item3, item4];
  var itemsToMove = [];

  var containerRed = {
    type: 0,
    x: 0,
    y: 0,
    width: containerWidth,
    height: containerHeight,
    score: 0
  };

  var containerBlue = {
    type: 1,
    x: 0,
    y: 0,
    width: containerWidth,
    height: containerHeight,
    score: 0
  };

  var containerGreen = {
    type: 2,
    x: 0,
    y: 0,
    width: containerWidth,
    height: containerHeight,
    score: 0
  };
  
  var containers = [containerRed, containerGreen, containerBlue];

  // ------------------------------
  // VARIABLES
  // ------------------------------

  var totalScore = 0;
  var pointerActive = false;
  var picked = false;

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
    picked = false;
    itemsToMove = [];
  }, false);
  
  addEventListener("mousemove", function (e) {
    if (pointerActive) {
      pointer = getMousePos(e);
      itemsToMove.forEach(function(iTM) {
        iTM.x = pointer.x;
        iTM.y = pointer.y;
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
    picked = false;
    itemsToMove = [];
  }, false);

  addEventListener("touchmove", function (e) {
    if (pointerActive) {
      pointer = getTouchPos(e);
      itemsToMove.forEach(function(iTM) {
        iTM.x = pointer.x;
        iTM.y = pointer.y;
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
        if (collides(item, pointer) && !picked) {
          itemsToMove.push(item);
          picked = true;
        }
      });
    }

    items.forEach(function(item) {
      containers.forEach(function(container) {
        if (collides(item, container)) {
          if (item.type === container.type) {
            container.score += 100;
          } else {
            container.score -= 50;
            if (container.score < 0) {
              container.score = 0;
            }
          }
          item.active = false;
        }
      });
    });
  };

  // Update game objects
  var update = function (modifier) {
    handleCollisions();
    items.forEach( function(item) {
      item.y += 0.1;
      if((item.y+itemHeight) >= (canvas.height) || !item.active) {
        item.x = parseInt(Math.random() * (canvas.width - 20) + 10);
        item.y = 20;
        item.type = parseInt(Math.random() * 3);
        item.active = true;
        pointerActive = false;
      };
    });
    score = containerRed.score + containerGreen.score + containerBlue.score;
  };
 
  var render = function () {
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    items.forEach( function(item) {
      if(item.type === 0) {
        ctx.fillStyle = "red";
      } else if(item.type === 1) {
        ctx.fillStyle = "blue";
      } else if(item.type === 2) {
        ctx.fillStyle = "green";
      }
      ctx.fillRect(item.x, item.y, itemWidth, itemHeight);
    });

    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.fillRect(containerRed.x, containerRed.y-40, containerRed.width, containerRed.height+40);
    ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
    ctx.fillRect(containerBlue.x, containerBlue.y-40, containerBlue.width, containerBlue.height+40);
    ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
    ctx.fillRect(containerGreen.x, containerGreen.y-40, containerGreen.width, containerGreen.height+40);

    ctx.font = "16px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.fillText("Red: " + containerRed.score, 5, 5);
    ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
    ctx.fillText("Blue: " + containerBlue.score, 5, 20);
    ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
    ctx.fillText("Green: " + containerGreen.score, 5, 35);
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillText("SCORE: " + score, 5, 50);
  };

  var main = function () {
    var now = Date.now();
    var delta = now - then;

    update(delta/1000);
    render();

    then = now;
  };

  items.forEach( function(item) {
    item.x = parseInt(Math.random() * (canvas.width - 50));
    item.y = 20;
    item.type = parseInt(Math.random() * 3);
  });
  containerRed.x = (canvas.width/6)*1 - (containerWidth/2);
  containerRed.y = canvas.height - (containerHeight + 10);
  containerBlue.x = (canvas.width/6)*3 - (containerWidth/2);
  containerBlue.y = canvas.height - (containerHeight + 10);
  containerGreen.x = (canvas.width/6)*5 - (containerWidth/2);
  containerGreen.y = canvas.height - (containerHeight + 10);
  var then = Date.now();
  setInterval(main, 1);
}
