// ------------------------------
// CONTAINER
// ------------------------------

define(function (require) {
  var constants = require('constants'),
      Container = {};
      
  Container = function (type) {
    this.x = 0;
    this.y = 0;
    this.type = type;
    this.width = constants.containerWidth;
    this.height = constants.containerHeight;
    this.hits = 0;
    this.misses = 0;
  }

  Container.prototype.init = function (canvas) {
    this.x = (canvas.width/6)*(this.type*2+1) - (constants.containerWidth/2);
    this.y = canvas.height - (constants.containerHeight*0.25 + 10);
  }

  return Container;

});
