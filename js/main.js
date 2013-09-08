define(function (require) {

  var canvas = require("canvas"),
      timer = require("timer"),
      functions = require("functions"),
      controls = require("controls"),
      requestAnimationFrame = require("requestAnimationFrame"),
      Menu = require("menu"),
      Classification = require("classification"),
      Tapping = require("tapping"),

      ctx = canvas.getContext("2d"),
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
  menu.init();

  loop = function () {

    if (inMenu) {
      option = menu.update();
      switch(option) {
        case 0:
          classification = {};
          tapping = {};
          paths = {};
          menu.render(canvas, ctx);
          break;
        case 1:
          inMenu = false;
          inClassification = true;
          classification = new Classification();
          classification.init(canvas);
          then = Date.now();
          break;
        case 2:
          inMenu = false;
          inTapping = true;
          tapping = new Tapping();
          tapping.init(canvas);
          then = Date.now();
          break;
        // case 3:
        //   inMenu = false;
        //   inPaths = true;
        //   paths = new Paths();
        //   paths.init(canvas);
        //   then = Date.now();
        //   break;
        default:
          break;
      }
      timer.time = 0;
      timer.lastBorn = 0;
    } else if (inClassification) {
      option = 0;

      now = Date.now();
      delta = now - then;
      timer.time += (delta/1000);
      
      inClassification = classification.update(delta/1000);
      classification.render(canvas, ctx);

      inMenu = !inClassification;

      then = now;
    } else if (inTapping) {
      option = 0;

      now = Date.now();
      delta = now - then;
      timer.time += (delta/1000);
      
      inTapping = tapping.update(delta/1000);
      tapping.render(canvas, ctx);

      inMenu = !inTapping;

      then = now;
    }

    requestAnimationFrame(loop);
  };

  loop();

});
