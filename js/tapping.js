function draw() {

  // Creating canvas
  var canvas = document.getElementById("game");
  var ctx = canvas.getContext("2d");
  canvas.width = 360;
  canvas.height = 640;

  // ------------------------------
  // CONSTANTS
  // ------------------------------
  var itemRadius = 20;

  // ------------------------------
  // OBJECTS
  // ------------------------------
  var timer = {
    time: 0
  }

  var pointer = {
    x: 0,
    y: 0,
    radius: 1
  };

  var item0 = {
    radius: itemRadius,
    type: 0,
    x: 0,
    y: 0,
    active: false,
    birthTime: 0,
    deathTime: 0
  };

  var item1 = {
    radius: itemRadius,
    type: 0,
    x: 0,
    y: 0,
    active: false,
    birthTime: 0,
    deathTime: 0
  };

  var item2 = {
    radius: itemRadius,
    type: 0,
    x: 0,
    y: 0,
    active: false,
    birthTime: 0,
    deathTime: 0
  };

  var item3 = {
    radius: itemRadius,
    type: 0,
    x: 0,
    y: 0,
    active: false,
    birthTime: 0,
    deathTime: 0
  };

  var item4 = {
    radius: itemRadius,
    type: 0,
    x: 0,
    y: 0,
    active: false,
    birthTime: 0,
    deathTime: 0
  };

  var items = [item0, item1, item2, item3, item4];

  // ------------------------------
  // VARIABLES
  // ------------------------------

  var totalScore = 0;
  var pointerActive = false;

  // ------------------------------
  // CONTROLS
  // ------------------------------

  // Mouse controls
  var getMousePos = function (e) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      radius: 1
    };
  };

  addEventListener("mousedown", function (e) {
    pointerActive = true;
    pointer = getMousePos(e);
  }, false);

  addEventListener("mouseup", function (e) {
    pointerActive = false;
  }, false);

  // Touch controls
  var getTouchPos = function (e) {
    return {
      x: e.targetTouches[0].pageX,
      y: e.targetTouches[0].pageY,
      radius: 1
    };
  };

  addEventListener("touchstart", function (e) {
    pointerActive = true;
    pointer = getTouchPos(e);
  }, false);

  addEventListener("touchend", function (e) {
    pointerActive = false;
  }, false);

  // ------------------------------
  // FUNCTIONS
  // ------------------------------

  // Distance
  var distance = function (a, b) {
    return Math.sqrt((b.x - a.x)*(b.x - a .x) + (b.y - a.y)*(b.y - a.y));
  };

  // Check collision
  var collides = function (a, b) {
    return distance(a,b) < a.radius + b.radius;
  };

  var handleCollisions = function () {
    if (pointerActive) {
      items.forEach(function(item) {
        if (collides(item, pointer)) {
          item.active = false;
          pointerActive = false;
          item.deathTime = timer.time;
          switch(item.type)
          {
            case 0:
              totalScore += 1;
              break;
            case 1:
              totalScore += 10;
              break;
            case 2:
              totalScore += 50;
              break;
          }
        }
      });
    }
  };
  
  // Sets random position and type for an item
  var initializeItem = function (item) {
      item.x = parseInt(Math.random() * (canvas.width - 40) + 20);
      item.y = parseInt(Math.random() * (canvas.height - 40) + 20);
      item.type = 0;
  };

  // UPDATE game objects
  var update = function (modifier) {
    timer.time += modifier;
    handleCollisions();
    items.forEach( function(item) {
      if(!item.active) {
        initializeItem(item);
        if(timer.time - item.deathTime >= 3) {
          item.active = true;
          item.birthTime = timer.time;
        }
      } else {
        if(timer.time - item.birthTime >= 2) {
          item.type = 1;
        }
        if(timer.time - item.birthTime >= 4) {
          item.type = 2;
        }
        if(timer.time - item.birthTime >= 5) {
          item.active = false;
          item.deathTime = timer.time;
          totalScore -= 100;
        }
      }
    });
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
  };

  // RENDER game objects
 
  var render = function () {
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.shadowColor = 'black';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    items.forEach( function(item) {
      if(item.active) {
        ctx.beginPath();
        ctx.arc(item.x,item.y,item.radius,0,2*Math.PI);
        switch(item.type) {
          case 0:
            ctx.fillStyle = "green";
            ctx.strokeStyle = "green";
            break;
          case 1:
            ctx.fillStyle = "yellow";
            ctx.strokeStyle = "yellow";
            break;
          case 2:
            ctx.fillStyle = "red";
            ctx.strokeStyle = "red";
            break;
        }
        ctx.fill();
        ctx.stroke();
      }
    });

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

  var main = function () {
    var now = Date.now();
    var delta = now - then;

    update(delta/1000);
    render();
    requestAnimationFrame(main);

    then = now;
  };

  items.forEach( function(item) {
    initializeItem(item);
  });

  var then = Date.now();
  setInterval(main, 1);
}
