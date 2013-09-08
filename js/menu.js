define(function (require) {

  var pointer   = require('pointer'),
      Button    = require('button');

  var Menu = function () {
    this.buttons = [];
  };

  // INITIALIZE THE MENU OBJECTS
  Menu.prototype.init = function () {
    this.buttons.push(new Button(80, 100, 200, 100, "rgba(50, 50, 255, 1)", "Classification"));
    this.buttons.push(new Button(80, 250, 200, 100, "rgba(50, 50, 255, 1)", "Tapping"));
    this.buttons.push(new Button(80, 400, 200, 100, "rgba(50, 50, 255, 1)", "Plant"));
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

    this.buttons.forEach( function (button) {
        button.render(ctx);
    });
  };

  return Menu;

});
