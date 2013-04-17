// Load image
var loadImage = function (name) {
  var image = new Image();
  image.src = name;
  return image;
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
