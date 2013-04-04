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
    active: true
  };

  var item1 = {
    radius: itemRadius,
    type: 0,
    x: 0,
    y: 0,
    active: true
  };

  var item2 = {
    radius: itemRadius,
    type: 0,
    x: 0,
    y: 0,
    active: true
  };

  var item3 = {
    radius: itemRadius,
    type: 0,
    x: 0,
    y: 0,
    active: true
  };

  var item4 = {
    radius: itemRadius,
    type: 0,
    x: 0,
    y: 0,
    active: true
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
          console.log("Collided!");
          item.active = false;
          totalScore += 100;
        }
      });
    }
  };

  // Update game objects
  var update = function (modifier) {
    handleCollisions();
    items.forEach( function(item) {
      if(!item.active) {
        item.x = parseInt(Math.random() * (canvas.width - 20) + 10);
        item.y = parseInt(Math.random() * (canvas.height - 50));
        item.type = parseInt(Math.random() * 3);
        item.active = true;
        pointerActive = false;
      };
    });
  };
 
  var render = function () {
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.shadowColor = 'black';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    items.forEach( function(item) {
      ctx.beginPath();
      ctx.arc(item.x,item.y,item.radius,0,2*Math.PI);
      if(item.type === 0) {
        ctx.fillStyle = "red";
        ctx.strokeStyle = "red";
      } else if(item.type === 1) {
        ctx.fillStyle = "blue";
        ctx.strokeStyle = "blue";
      } else if(item.type === 2) {
        ctx.fillStyle = "green";
        ctx.strokeStyle = "green";
      }
      ctx.fill();
      ctx.stroke();
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
    item.y = parseInt(Math.random() * (canvas.height - 50));
    item.type = parseInt(Math.random() * 3);
    item.active = true;
    pointerActive = false;
  });

  var then = Date.now();
  setInterval(main, 1);
}
