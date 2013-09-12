define(function (require) {

  var pointer     = require('pointer'),
      Button      = require('button');

  var Menu = function () {
    this.front    = new Image;
    this.buttons  = [];
  };

  // INITIALIZE THE MENU OBJECTS
  Menu.prototype.init = function () {
    this.front.src = "images/front.png";
    this.buttons.push(new Button(55, 370, 250, 100, "rgba(60, 175, 60, 1)", "Separem els residus!"));
    this.buttons.push(new Button(55, 480, 250, 100, "rgba(60, 175, 60, 1)", "Netegem el carrer!"));
  };

  // HANDLE COLLISIONS FOR MENU OBJECTS
  Menu.prototype.handleCollisions = function () {
    var value = 0;
    if (pointer.active) {
      this.buttons.forEach( function (button, index) {
        if (collides(button, pointer)) {
          value = index+1;
          pointer.active = false;
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
    ctx.globalAlpha = 1;

    ctx.fillStyle = "rgba(170, 225, 255, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(this.front, 55, 40, 250, 250);

    ctx.shadowColor = "black";
    ctx.shadowBlur = 1;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255, 120, 0, 1)";
    ctx.fillText("Escull un joc per començar", 180, 300);
    ctx.fillText("a cuidar el medi ambient:", 180, 325);

    this.buttons.forEach( function (button) {
        button.render(ctx);
    });
  };

  return Menu;

});
