define(function (require) {

  var pointer   = require('pointer'),
      Button    = require('button');

  var Menu = function () {
    this.buttons = [];
  };

  // INITIALIZE THE MENU OBJECTS
  Menu.prototype.init = function () {
    this.buttons.push(new Button(80, 200, 200, 100, "rgba(0, 0, 255, 1)", "Classification"));
    this.buttons.push(new Button(80, 350, 200, 100, "rgba(0, 0, 255, 1)", "Tapping"));
  };

  // HANDLE COLLISIONS FOR MENU OBJECTS
  Menu.prototype.handleCollisions = function () {
    var value = 0;
    if (pointer.active) {
      this.buttons.forEach( function (button, index) {
        if (collides(button, pointer)) {
          value = index+1;
        }
      });
    }

    return value;
  };
    
  // UPDATE MENU OBJECTS
  Menu.prototype.update = function () {
    return this.handleCollisions();
  };

  // RENDER MENU OBJECTS
  Menu.prototype.render = function (canvas, ctx) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.shadowColor = 'black';
    ctx.shadowBlur = 1;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    this.buttons.forEach( function (button) {
        button.render(ctx);
    });

    ctx.shadowColor = 'white';
  };

  return Menu;

});
