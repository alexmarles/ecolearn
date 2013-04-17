// Load image
var loadImage = function (name) {
  var image = new Image();
  image.src = name;
  return image;
};

// Check collision
var collides = function (a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
};
