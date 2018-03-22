var faceColors = [
    [1.0,  1.0,  1.0,  1.0],    // Front face: white
    [1.0,  1.0,  1.0,  1.0],    // Front face: white

    [1.0,  0.0,  0.0,  1.0],    // Front face: white

    [0.0,  1.0,  0.0,  1.0],    // Front face: white
    [0.0,  1.0,  0.0,  1.0],    // Front face: white
];
var indices = [
    0,  1,  2,      0,  2,  3,    // front
    3,  4,  5,      2,  3,  5,
    4,  5,  6,      5,  6,  7,

    8,  9, 10,      8,  10, 11,

    12, 13, 14,     12, 14, 15,

    16, 17, 18
];
var vertices = [
    // Front face
    -0.25, -1.0,  1.0,
     0.25, -1.0,  1.0,
     0.75, -0.75,  1.0,
    -0.75, -0.75,  1.0, // 3

    -0.75,  0.0,  1.0,
     0.75,  0.0,  1.0,
    -0.25,  0.25,  1.0,
     0.25,  0.25,  1.0, // 7

    -0.75, -0.75,  1.0,
    -0.75,  0.0,  1.0,
    -0.75,  0.0,  -1.0,
    -0.75, -0.75,  -1.0, // 11

    0.75, -0.75,  1.0,
    0.75,  0.0,  1.0,
    0.75,  0.0,  -1.0,
    0.75, -0.75,  -1.0, // 15

    -0.75,  0.0,  1.0,
    -0.25,  0.25,  1.0,
    -0.75,  0.0,  -1.0, // 18
];

var ShipMesh = () => {
    return {
        indices: () => { return indices; },
        vertices: () => { return vertices; },
        color: () => {
            var c = [];
            for(var j = 0; j < faceColors.length; ++j) {
                const color = faceColors[j];
                c = c.concat(color, color, color, color);
            }
            return c;
        }
    };
};
