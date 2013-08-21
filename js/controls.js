// ------------------------------
// CONTROLS
// ------------------------------

define(function (require) {

  var pointer = require('pointer');

  // MOUSE CONTROLS
  addEventListener("mousedown", function (e) {
    pointer.active = true;
    pointer.getMousePos(e);
  }, false);

  addEventListener("mouseup", function (e) {
    pointer.active = false;
  }, false);

  addEventListener("mousemove", function (e) {
    if (pointer.active) {
      pointer.getMousePos(e);
    }
  }, false);
  // ------------------------------

  // TOUCH CONTROLS
  addEventListener("touchstart", function (e) {
    pointer.active = true;
    pointer.getTouchPos(e);
  }, false);

  addEventListener("touchend", function (e) {
    pointer.active = false;
  }, false);
  // ------------------------------

});
