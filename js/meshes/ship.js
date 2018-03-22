var ShipMesh = () => {
    const shipBackZ = -1.5;

    const faceColors = [
        [1.0,  1.0,  1.0,  1.0],    // Front face: white
        [1.0,  1.0,  1.0,  1.0],    // Front face: white

        [1.0,  0.0,  0.0,  1.0],    // Front face: white

        [0.0,  1.0,  0.0,  1.0],    // Front face: white

        [0.0,  1.0,  0.0,  1.0],    // Front face: white

        [1.0,  0.0,  0.0,  1.0],    // Front face: white

        [1.0,  0.0,  1.0,  1.0],    // Front face: white

        [1.0,  0.0,  1.0,  1.0],    // Front face: white

        [1.0,  0.0,  1.0,  1.0],    // Front face: white

        [1.0,  0.0,  0.0,  1.0],    // Front face: white
    ];
    const indices = [
        0,  1,  2,      0,  2,  3,    // front
        3,  4,  5,      2,  3,  5,
        4,  5,  6,      5,  6,  7,

        8,  9, 10,      8,  10, 11,

        12, 13, 14,     12, 14, 15,

        16, 17, 18,      16, 18, 19,

        20, 21, 22,     20, 22, 23,

        24, 25, 26,     24, 26, 27,

        28, 29, 30,      28, 30, 31,

        32, 33, 34,      32, 34, 35,

        36, 37, 38,      36, 38, 39,
    ];
    const vertices = [
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
        -0.75,  0.0,  shipBackZ,
        -0.75, -0.75, shipBackZ, // 11

        0.75, -0.75,  1.0,
        0.75,  0.0,  1.0,
        0.75,  0.0,  shipBackZ,
        0.75, -0.75, shipBackZ, // 15

        -0.75,  0.0,  1.0,
        -0.25,  0.25,  1.0,
        -0.25,  0.25,  shipBackZ,
        -0.75,  0.0,  shipBackZ, // 19

        0.75,  0.0,  1.0,
        0.25,  0.25,  1.0,
        0.25,  0.25,  shipBackZ,
        0.75,  0.0,  shipBackZ, // 23

        // TOP
       -0.25,  0.25,  1.0,
       -0.25,  0.25,  shipBackZ,
        0.25,  0.25,  shipBackZ,
        0.25,  0.25,  1.0, // 27

        // Bottom-side left.
       -0.75, -0.75, shipBackZ,
       -0.75, -0.75,  1.0,
       -0.25, -1.0,   1.0,
       -0.25, -1.0,  shipBackZ, // 31

        // Bottom-side right.
        0.75, -0.75, shipBackZ,
        0.75, -0.75,  1.0,
        0.25, -1.0,   1.0,
        0.25, -1.0,  shipBackZ, // 35


      -0.25, -1.0,  1.0,
      -0.25, -1.0,  shipBackZ,
       0.25, -1.0,  shipBackZ,
       0.25, -1.0,  1.0, // 39
    ];

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
