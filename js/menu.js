define(function (require) {

  var pointer   = require('pointer'),
      Button    = require('button');

  var Menu = function () {
    this.buttons = [];
  };

  // INITIALIZE THE MENU OBJECTS
  Menu.prototype.init = function () {
    this.buttons.push(new Button(50, 100, 250, 100, "rgba(50, 50, 255, 1)", "Separem els residus!"));
    this.buttons.push(new Button(50, 250, 250, 100, "rgba(50, 50, 255, 1)", "Netejem el carrer!"));
    this.buttons.push(new Button(50, 400, 250, 100, "rgba(50, 50, 255, 1)", "Reciclem-ho tot!"));
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
