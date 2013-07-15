define(function (require) {

  var canvas = require('canvas'),
      timer = require('timer'),
      requestAnimationFrame = require('requestAnimationFrame'),
      Menu = require('menu'),
      Classification = require('classification'),

      ctx = canvas.getContext('2d'),
      inMenu = true,
      inClassification = false,
      inTapping = false,
      inPaths = false,
      loop = {},
      menu = {},
      classification = {},
      tapping = {},
      paths = {},
      main = {},
      now = 0,
      delta = 0,
      option = 0,
      then = 0;

  menu = new Menu();
  classification = new Classification();

  menu.init();
  classification.init(canvas);

  loop = function () {
    now = Date.now();
    delta = now - then;
    option = 0;
    timer.time += (delta/1000);

    if (inMenu) {
      option = menu.update();
      switch(option) {
        case 0:
          menu.render(canvas, ctx);
          break;
        case 1:
          inMenu = false;
          inClassification = true;
          break;
        case 2:
          inMenu = false;
          inTapping = true;
          break;
        case 3:
          inMenu = false;
          inPaths = true;
          break;
        default:
          break;
      }
    } else if (inClassification) {
      classification.update(delta/1000);
      classification.render(canvas, ctx);
    }

    then = now;

    requestAnimationFrame(loop);
  };

  then = Date.now();
  loop();

});
