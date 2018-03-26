/*
  Extension functions for Math class.
*/

Math.PITCH = 0;
Math.YAW = 1;
Math.ROLL = 2;
Math.X = 0;
Math.Y = 1;
Math.Z = 2;

Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
}

Math.degrees = (radians) => {
  return radians * 180 / Math.PI;
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

Math.sinCos = (sin, cos, rad) => {
  sin = Math.sin(rad);
  cos = Math.cos(rad);
}
Math.angleVectors = (angle, forward) => {
  var sr, sp, sy, cr, cp, cy;

  Math.sinCos(sp,cp,
    Math.radians(angle[Math.PITCH])
  );
  Math.sinCos(sy,cy,
    Math.radians(angle[Math.YAW])
  );

  forward[Math.X] = cp * cy;
  forward[Math.Y] = cp * sy;
  forward[Math.Z] = -sp;
};

Math.screenToWorld = (invViewProjection, screenCoords, screenWidth, screenHeight) => {
  var x = 2 * screenCoords[Math.X] / screenWidth - 1;
  var y = 1 - (2 * screenCoords[Math.Y] / screenHeight);
  var z = 0;
  var worldPos = vec3.fromValues(x,y,z);
  vec3.transformMat4(worldPos, worldPos, invViewProjection);

  return worldPos;
};

Math.lerp = (a, b, t) => {
  return (1 - t) * a + t * b;
};

Math.between = (a, b, c, inclusive = true) => {
  return a <= c && c <= b;
}
