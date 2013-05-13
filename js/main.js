function main() {

  // Creating canvas
  var canvas = document.createElement(navigator.isCocoonJS ? 'screencanvas' : 'canvas');
  canvas.id = 'game';
  document.body.appendChild(canvas);
  var ctx = canvas.getContext("2d");
  canvas.width = 360;
  canvas.height = 640;

  // CONSTANTS
  var pointer = new Pointer(canvas);

  // OBJECTS
  var runClassification = function () { return true; };
  var runTapping = function () { return true; };
  var buttons = [];
  buttons.push(new Button(80, 200, 200, 100, "rgba(0, 0, 255, 1)", "Classification", runClassification()));
  buttons.push(new Button(80, 350, 200, 100, "rgba(0, 0, 255, 1)", "Tapping", runTapping()));

  // ------------------------------
  // CONTROLS
  // ------------------------------

  // Mouse Controls
  addEventListener("mousedown", function (e) {
    pointer.active = true;
    pointer.getMousePos(e);
  }, false);

  addEventListener("mouseup", function (e) {
    pointer.active = false;
  }, false);

  // Touch Controls
  addEventListener("touchstart", function (e) {
    pointer.active = true;
    pointer.getTouchPos(e);
  }, false);

  addEventListener("touchend", function (e) {
    pointer.active = false;
  }, false);

  // ------------------------------
  // FUNCTIONS
  // ------------------------------

  var handleCollisions = function () {
    if (pointer.active) {
      buttons.forEach(function(button) {
        if (collides(button, pointer)) {
          classification(canvas, ctx);
        }
      });
    }
  };
  
  // UPDATE
  var update = function () {
    handleCollisions();
  };

  // RENDER
  var render = function () {
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.shadowColor = 'black';
    ctx.shadowBlur = 1;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    buttons.forEach( function (button) {
        button.render(ctx);
    });

    ctx.shadowColor = 'white';
  };

  // Request Animation Frame for loop
  var requestAnimFrame = (function () {
    return  window.requestAnimationFrame       ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    function( callback ){
      window.setTimeout(callback, 1000 / 60);
    };
  })();

  // LOOP
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
  loop();

}
