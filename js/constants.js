define(function (require) {

  var Constants = {};

  Constants = function () {
    this.frequency = 2;
    this.speed = 50;
    this.containerWidth = 110;
    this.containerHeight = 150;
    this.itemWidth = 80;
    this.bubbleRadius = 15;
    this.hit = 50;
    this.miss = 100;
    this.font = "chalkdustregular";
  };

  return new Constants();

});
