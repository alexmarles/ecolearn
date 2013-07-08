// ------------------------------
// POINTER
// ------------------------------

define(function (require) {
  
  var canvas = require('canvas'),
      ctx = canvas.getContext('2d'),
      Pointer = {};

  Pointer = function (canvas) {
    this.canvas = canvas;
    this.x = 0;
    this.y = 0;
    this.width = 1;
    this.height = 1;
    this.active = false;
  };

  Pointer.prototype.getMousePos = function (e) {
    var rect = this.canvas.getBoundingClientRect();
    this.x = e.clientX - rect.left;
    this.y = e.clientY - rect.top;
  };

  Pointer.prototype.getTouchPos = function (e) {
    this.x = e.targetTouches[0].pageX;
    this.y = e.targetTouches[0].pageY;
  };

  return new Pointer(canvas);

});
