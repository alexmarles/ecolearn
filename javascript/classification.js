function draw() {

  // Creating canvas
  var canvas = document.getElementById("game");
  var ctx = canvas.getContext("2d");
  // canvas.width = 360;
  // canvas.height = 640;
  canvas.width = window.innerWidth/2;
  canvas.height = window.innerHeight/2;

  // Constants
  var kbLeft = 37;
  var kbUp = 38;
  var kbRight = 39;
  var kbDown = 40;

  var itemSpeed = 150;
  var itemWidth = 40;
  var itemHeight = 40;

  var containerWidth = 50;
  var containerHeight = 75;

  // Objects
  var pointer = {
    x: 0,
    y: 0,
    width: 1,
    height: 1
  };

  var item = {
    speed: itemSpeed,
    type: 0,
    x: 0,
    y: 0,
    width: itemWidth,
    height: itemHeight
  };

  var containerRed = {
    type: 0,
    x: 0,
    y: 0
  };

  var containerBlue = {
    type: 1,
    x: 0,
    y: 0
  };

  var containerGreen = {
    type: 2,
    x: 0,
    y: 0
  };

  var itemsRed = 0;
  var itemsBlue = 0;
  var itemsGreen = 0;
  var items = 0;

  // Check collision
  var collided = false;

  var checkCollision = function (one, two) {
    if(two.x >= one.x && two.x <= (one.x + one.width)) {
      if(two.y >= one.y && two.y <= (one.y + one.height)) {
        collided = true;
      }
    }
  };

  // Keyboard controls
  var keysDown = {};

  addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
  }, false);

  addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
  }, false);

  // Mouse controls
  var mouseDown = false;
  var mousePos;
  
  var getMousePos = function (e) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  addEventListener("mousedown", function (e) {
    mouseDown = true;
    mousePos = getMousePos(e);
    pointer.x = mousePos.x;
    pointer.y = mousePos.y;
    checkCollision(item, pointer);
    console.log("MOUSE DOWN");
    console.log("Mouse position: " + mousePos.x + ", " + mousePos.y);
  }, false);

  addEventListener("mouseup", function (e) {
    mouseDown = false;
    collided = false;
    console.log("MOUSE UP");
  }, false);
  
  addEventListener("mousemove", function (e) {
    if(mouseDown) {
      mousePos = getMousePos(e);
      console.log("Mouse position: " + mousePos.x + ", " + mousePos.y);
      if(collided) {
        item.x = mousePos.x;
        item.y = mousePos.y;
      }
    }
  }, false);

  // Reset the game when item is in container line
  var reset = function () {
    item.x = canvas.width / 2;
    item.y = 20;
    item.type = parseInt(Math.random() * 3);

    containerRed.x = (canvas.width/6)*1 - (containerWidth/2);
    containerRed.y = canvas.height - (containerHeight + 10);
    containerBlue.x = (canvas.width/6)*3 - (containerWidth/2);
    containerBlue.y = canvas.height - (containerHeight + 10);
    containerGreen.x = (canvas.width/6)*5 - (containerWidth/2);
    containerGreen.y = canvas.height - (containerHeight + 10);
  };

  // Update game objects
  var update = function (modifier) {
    item.y += 0.3;

    if(kbDown in keysDown) {
      if(item.y+itemHeight <= canvas.height) {
        item.y += item.speed*modifier;
      }
    }
    if(kbLeft in keysDown) {
      if(item.x > 0) {
        item.x -= item.speed*modifier;
      }
    }
    if(kbRight in keysDown) {
      if(item.x+itemWidth <= canvas.width) {
        item.x += item.speed*modifier;
      }
    }

    if((item.y+itemHeight) >= (canvas.height-containerHeight/2)) {
      if((item.x >= containerRed.x
          && item.x <= (containerRed.x+containerWidth)
          && item.type == containerRed.type)
          ||
          ((item.x+itemWidth) >= containerRed.x
           && (item.x+itemWidth) <= (containerRed.x+containerWidth)
           && item.type == containerRed.type)
        ) {
          ++itemsRed;
      }
      if((item.x >= containerBlue.x
          && item.x <= (containerBlue.x+containerWidth)
          && item.type === containerBlue.type)
          ||
          ((item.x+itemWidth) >= containerBlue.x
           && (item.x+itemWidth) <= (containerBlue.x+containerWidth)
           && item.type == containerBlue.type)
        ) {
          ++itemsBlue;
      }
      if((item.x >= containerGreen.x
          && item.x <= (containerGreen.x+containerWidth)
          && item.type === containerGreen.type)
          ||
          ((item.x+itemWidth) >= containerGreen.x
           && (item.x+itemWidth) <= (containerGreen.x+containerWidth)
           && item.type == containerGreen.type)
        ) {
          ++itemsGreen;
      }
      reset();
      collided = false;
    }
  };
 
  var render = function () {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if(item.type == 0) {
      ctx.fillStyle = "red";
    } else if(item.type == 1) {
      ctx.fillStyle = "blue";
    } else if(item.type == 2) {
      ctx.fillStyle = "green";
    }
    ctx.fillRect(item.x, item.y, itemWidth, itemHeight);

    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.fillRect(containerRed.x, containerRed.y, containerWidth, containerHeight);
    ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
    ctx.fillRect(containerBlue.x, containerBlue.y, containerWidth, containerHeight);
    ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
    ctx.fillRect(containerGreen.x, containerGreen.y, containerWidth, containerHeight);

    ctx.font = "16px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.fillText("Red: " + itemsRed, 5, 5);
    ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
    ctx.fillText("Blue: " + itemsBlue, 5, 20);
    ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
    ctx.fillText("Green: " + itemsGreen, 5, 35);

    ctx.font = "12px Helvetica";
    ctx.fillText("Pos item: (" + parseInt(item.x) + ", " + parseInt(item.y) +" )", 100, 5);
    ctx.fillText("Type item: " + parseInt(item.type), 100, 15);
  };

  var main = function () {
    var now = Date.now();
    var delta = now - then;

    update(delta/1000);
    render();

    then = now;
  };

  reset();
  var then = Date.now();
  setInterval(main, 1);
}
