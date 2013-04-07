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
  var timer = {
    time: 0
  }

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
    deathTime: 0,
    active: false,
    picked: false
  };

  var item1 = {
    speed: itemSpeed,
    type: 0,
    x: 0,
    y: 0,
    width: itemWidth,
    height: itemHeight,
    deathTime: 0,
    active: false,
    picked: false
  };

  var item2 = {
    speed: itemSpeed,
    type: 0,
    x: 0,
    y: 0,
    width: itemWidth,
    height: itemHeight,
    deathTime: 0,
    active: false,
    picked: false
  };

  var item3 = {
    speed: itemSpeed,
    type: 0,
    x: 0,
    y: 0,
    width: itemWidth,
    height: itemHeight,
    deathTime: 0,
    active: false,
    picked: false
  };

  var item4 = {
    speed: itemSpeed,
    type: 0,
    x: 0,
    y: 0,
    width: itemWidth,
    height: itemHeight,
    deathTime: 0,
    active: false,
    picked: false
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
    hasObject = false;
    items.forEach(function(item) {
      item.picked = false;
    });
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
            container.score += 100;
          } else {
            container.score -= 50;
            if (container.score < 0) {
              container.score = 0;
            }
          }
          item.picked = false;
          item.active = false;
          item.deathTime = timer.time;
        }
      });
      if ((item.y+itemHeight) >= canvas.height) {
        item.picked = false;
        item.active = false;
        item.deathTime = timer.time;
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
    if (timer.time <= 5) {
      switch(parseInt(timer.time)) {
        case 2:
          items[0].active = true;
          items[0].birthTime = timer.time;
          items[1].active = true;
          items[1].birthTime = timer.time;
          break;
        case 4:
          items[2].active = true;
          items[2].birthTime = timer.time;
          items[3].active = true;
          items[3].birthTime = timer.time;
          break;
        case 5:
          items[4].active = true;
          items[4].birthTime = timer.time;
          break;
      }
    }
    handleCollisions();
    itemsToMove = [];
    items.forEach( function(item) {
      if (item.picked) {
        itemsToMove.push(item);
      }
      item.y += 0.5;
      if (!item.active) {
        initializeItem(item);
        if (timer.time - item.deathTime >= 3) {
          item.active = true;
        }
      };
    });
    totalScore = containerRed.score + containerGreen.score + containerBlue.score;
  };
 
  var render = function () {
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.shadowColor = 'black';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    items.forEach( function(item) {
      if (item.active) {
        switch(item.type) {
          case 0:
            ctx.fillStyle = "red";
            break;
          case 1:
            ctx.fillStyle = "blue";
            break;
          case 2:
            ctx.fillStyle = "green";
            break;
        }
        ctx.fillRect(item.x, item.y, itemWidth, itemHeight);
      }
    });
    
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.fillRect(containerRed.x, containerRed.y-itemHeight, containerRed.width, containerRed.height+itemHeight);
    ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
    ctx.fillRect(containerBlue.x, containerBlue.y-itemHeight, containerBlue.width, containerBlue.height+itemHeight);
    ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
    ctx.fillRect(containerGreen.x, containerGreen.y-itemHeight, containerGreen.width, containerGreen.height+itemHeight);

    ctx.shadowColor = 'white';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillText("SCORE: " + totalScore, 5, 5);
    ctx.fillText("TIME: " + parseInt(timer.time), 250, 5);
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

  // Main program

  var main = function () {
    var now = Date.now();
    var delta = now - then;
    timer.time += (delta/1000);

    update(delta/1000);
    render();

    then = now;

    requestAnimFrame(main);
  };

  items.forEach( function(item) {
    initializeItem(item);
  });

  containerRed.x = (canvas.width/6)*1 - (containerWidth/2);
  containerRed.y = canvas.height - (containerHeight + 10);
  containerBlue.x = (canvas.width/6)*3 - (containerWidth/2);
  containerBlue.y = canvas.height - (containerHeight + 10);
  containerGreen.x = (canvas.width/6)*5 - (containerWidth/2);
  containerGreen.y = canvas.height - (containerHeight + 10);

  var then = Date.now();
  main();
}
