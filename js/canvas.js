define(function (require) {

  // Creating canvas
  var canvas = document.createElement(navigator.isCocoonJS ? 'screencanvas' : 'canvas');
  canvas.id = 'game';
  document.body.appendChild(canvas);
  canvas.width = 360;
  canvas.height = 640;

  return canvas;
  
});
