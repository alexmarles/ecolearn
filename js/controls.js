// ------------------------------
// CONTROLS
// ------------------------------

// MOUSE CONTROLS
addEventListener("mousedown", function (e) {
  window.pointer.active = true;
  window.pointer.getMousePos(e);
}, false);

addEventListener("mouseup", function (e) {
  window.pointer.active = false;
}, false);

addEventListener("mousemove", function (e) {
  if (window.pointer.active) {
    window.pointer.getMousePos(e);
  }
}, false);
// ------------------------------

// TOUCH CONTROLS
addEventListener("touchstart", function (e) {
  window.pointer.active = true;
  window.pointer.getTouchPos(e);
}, false);

addEventListener("touchend", function (e) {
  window.pointer.active = false;
}, false);
// ------------------------------
