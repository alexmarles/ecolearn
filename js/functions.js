// Load image
var loadImages = function (names, callback) {
  var i, l, images = [], intervalId;

  for (i = 0, l = names.length; i < l; i += 1) {
    loadImage(names[i], function (image) {
      images.push(image);
    });
  }

  intervalId = setInterval(function () {
    if (images.length === names.length) {
      clearInterval(intervalId);
      callback(images);
    }
  }, 0);
};

var loadImage = function (name, callback) {
  var image = new Image();
  image.src = name;
  image.addEventListener("load", function () {
      callback(image);
  });
};

// Returns a random number between 0 and limit-1
var random = function (limit) {
  return parseInt(Math.random() * limit);
};

// Distance circle-circle
var distanceCircles = function (a, b) {
  return Math.sqrt((b.x - a.x)*(b.x - a .x) + (b.y - a.y)*(b.y - a.y));
};

// Check collision circle-circle
var collidesCircles = function (a, b) {
  return distanceCircles(a,b) < a.radius + b.radius;
};

// Check collision
var collides = function (a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
};
