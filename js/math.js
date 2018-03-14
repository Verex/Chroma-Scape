/*
  Extension functions for Math class.
*/

Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
}

Math.edistance = function(p1, p2) {
  return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}

Math.randomRange = function(min, max) {
  return Math.random() * (max - min) + min;
}

Math.randInt = function(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}
