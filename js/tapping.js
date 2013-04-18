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
  var frequency = 2;
 
  var itemWidth = 100;

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
  var itemData = {
    images: [],
    sizes: {
      poke0: itemWidth,
      poke1: itemWidth,
      poke2: itemWidth
    }
  };

  // ------------------------------
  // CONTROLS
  // ------------------------------

  // Mouse controls
  var getMousePos = function (e) {
    var rect = canvas.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
  };

  addEventListener("mousedown", function (e) {
    pointerActive = true;
    getMousePos(e);
  }, false);

  addEventListener("mouseup", function (e) {
    pointerActive = false;
  }, false);

  // Touch controls
  var getTouchPos = function (e) {
    pointer.x = e.targetTouches[0].pageX;
    pointer.y = e.targetTouches[0].pageY;
  };

  addEventListener("touchstart", function (e) {
    pointerActive = true;
    getTouchPos(e);
  }, false);

  addEventListener("touchend", function (e) {
    pointerActive = false;
  }, false);

  // ------------------------------
  // FUNCTIONS
  // ------------------------------
  var addNewItem = function () {
    var item = new Item(canvas, 0, 0, itemData);
    item.y = random(canvas.height - item.width);
    item.born = timer.time;
    items.push(item);
  };

  var handleCollisions = function () {
    if (pointerActive) {
      items.forEach(function(item) {
        if (collides(item, pointer)) {
          pointerActive = false;
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
          items.splice(items.indexOf(item),1);
        }
      });
    }
  };
  
  // UPDATE game objects
  var update = function (modifier) {
    if (timer.time - timer.lastBorn > frequency) {
      addNewItem();
      timer.lastBorn = timer.time;
    }
    handleCollisions();
    items.forEach( function(item) {
      if(timer.time - item.born >= 2) {
        item.changeType(1);
      }
      if(timer.time - item.born >= 4) {
        item.changeType(2);
      }
      if(timer.time - item.born >= 5) {
        items.splice(items.indexOf(item),1);
        totalScore -= 100;
        if (totalScore < 0) {
          totalScore = 0;
        }
      }
      item.rotation += 100 * modifier;
    });
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
      if (navigator.isCocoonJS) {
        ctx.beginPath();
        ctx.arc(item.x+(item.width/2)+1, item.y+(item.height/2)+1, item.height/2, 0, 2*Math.PI);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fill(),
        ctx.stroke();
      }
      item.rotate(ctx);
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

  // Main program

  var loop = function () {
    var now = Date.now();
    var delta = now - then;
    timer.time += (delta/1000);

    update(delta/1000);
    render();

    then = now;
    
    requestAnimFrame(loop);
  };

  var then = Date.now();

  loadImages({
      poke0: "images/poke0.png",
      poke1: "images/poke1.png",
      poke2: "images/poke2.png"
  }, function (loadedImages) {
    itemData.images = loadedImages;
    loop();
  });
}
