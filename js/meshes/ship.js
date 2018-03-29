var ShipMesh = () => {
    const front = -5.5; // Z position of
    const back  = 1;
    const top = 0.25;
    const bottom = -0.75;
    const left = -1;
    const right = 1;

    const middle = (top + bottom) * 0.5

    const primaryColor = [0.329, 0.224, 0.196, 1.0];
    const highlightColor = [0.573, 0.176, 0.071, 1.0];
    const shadeColor = [0.137, 0.133, 0.133, 1.0];
    const darkColor = [0.094, 0.09, 0.086, 1.0];

    const faceColors = [
        primaryColor,    // Back bottom
        primaryColor,    // Back middle
        primaryColor,    // Left panel
        primaryColor,    // Right Panel
        highlightColor,    // Top side left
        highlightColor,    // Top side right
        shadeColor,    // Top
        highlightColor,    // Bottom side left
        highlightColor,    // Bottom side left
        shadeColor,    // Bottom
        shadeColor, // Thruster.
        shadeColor,
        shadeColor,
        shadeColor,
        [1.0, 0.0, 1.0, 1.0], // Thruster middle innerColor.
        primaryColor,
        primaryColor,
        shadeColor,
        shadeColor,
    ];
    const indices = [
        0,  1,  2,      0,  2,  3,    // front
        3,  4,  5,      2,  3,  5,
        4,  5,  6,      5,  6,  7,

        8,  9, 10,      8,  9, 11,

        12, 13, 14,     12, 14, 15,

        16, 17, 18,      16, 18, 19,

        20, 21, 22,     20, 22, 23,

        24, 25, 26,     24, 26, 27,

        28, 29, 30,      28, 30, 31,

        32, 33, 34,      32, 34, 35,

        36, 37, 38,      36, 38, 39,

        // Main thruster.
        40, 41, 42,      40, 42, 43, // Top
        40, 44, 45,      40, 45, 41, // Left
        42, 46, 47,      42, 47, 43, // Right
        44, 45, 46,      44, 46, 47, // Bottom
        48, 49, 50,      48, 50, 51, // Inner top
        52, 53, 54,      52, 54, 55, // Inner bottom
        48, 52, 53,      48, 53, 49, // Inner left
        50, 54, 55,      50, 55, 51, // Inner right
        41, 49, 50,      41, 50, 42, // Front top
        45, 53, 54,      45, 54, 46, // Front bottom
        41, 49, 53,      41, 53, 45, // Front Left
        42, 50, 54,      42, 54, 46, // Front bottom
        56, 57, 58,      56, 58, 59,

        60, 61, 62,       60, 62, 63,
        64, 65, 66,       64, 66, 67,
        68, 69, 70,      68, 70, 71,
        72, 73, 74,       72, 74, 75,
    ];
    const vertices = [
        // Back panel bottom.
        -0.25, bottom,  back,
         0.25, bottom,  back,
         right, bottom + 0.25,  back,
         left, bottom + 0.25,  back, // 3

        // Back panel bottom.
         left,  top - 0.25,  back,
         right,  top - 0.25,  back,
        -0.25,  top,  back,
         0.25,  top,  back, // 7

         // Left panel.
         left, bottom + 0.25, front,
         left,  top - 0.25,  back,
         left,  top - 0.25,  front,
         left, bottom + 0.25, back, // 11

        // Right panel
        right, bottom + 0.25, front,
        right, top - 0.25,  front,
        right, top - 0.25,  back,
        right, bottom + 0.25,  back,// 15

        // Left top panel.
        -0.25,  top,  back,
        left,  top - 0.25,  back,
        left,  top - 0.25,  front,
        -0.25,  top,  back, // 19

        // Right top panel.
        right,  top - 0.25,  front,
        right,  top - 0.25,  back,
        0.25,  top,  back,
        right,  top - 0.25,  front, // 23

        // Top panel.
       -0.25,  top,  back,
        left,  top - 0.25,  front,
        right, top - 0.25,  front,
        0.25,  top,  back, // 27

        // Left bottom panel.
        left, bottom + 0.25,  back,
        left, bottom + 0.25, front,
        -0.25, bottom, back,
        left, bottom + 0.25, front, // 31

        // Right bottom panel.
        right, bottom + 0.25,  back,
        right, bottom + 0.25, front,
        0.25, bottom, back,
        right, bottom + 0.25,  front, // 35

        // Bottom panel.
        -0.25, bottom,  back,
         left, bottom + 0.25,  front,
         right, bottom + 0.25,  front,
         0.25, bottom,  back, // 39

       // Thruster top
       left, top - 0.25, back,
       left, top - 0.25, back + 0.25,
       right, top - 0.25, back + 0.25,
       right, top - 0.25, back, // 43

      // Thruster bottom
      left, bottom + 0.25, back,
      left, bottom + 0.25, back + 0.25,
       right, bottom + 0.25, back + 0.25,
       right, bottom + 0.25, back, // 47

     // Thruster inner top
     left + 0.1, top - 0.25 - 0.1, back,
     left + 0.1, top - 0.25 - 0.1, back + 0.25,
     right - 0.1, top - 0.25 - 0.1, back + 0.25,
     right - 0.1, top - 0.25 - 0.1, back, // 51

      // Thruster inner bottom
      left + 0.1, bottom + 0.25 + 0.1, back,
      left + 0.1, bottom + 0.25 + 0.1, back + 0.25,
      right - 0.1, bottom + 0.25 + 0.1, back + 0.25,
      right - 0.1, bottom + 0.25 + 0.1, back, // 55

       // Thruster inner.
       left + 0.1, bottom + 0.25 + 0.1, back + (0.25 * 0.5),
       left + 0.1, top - 0.25 - 0.1, back + (0.25 * 0.5),
       right - 0.1, top - 0.25 - 0.1, back + (0.25 * 0.5),
       right - 0.1, bottom + 0.25 + 0.1, back + (0.25 * 0.5), // 59

       left, bottom + 0.25, front,
       left,  top - 0.25,  front,
       left, middle, front - 1.0,
       left, bottom + 0.25, front, //63

       right, bottom + 0.25, front,
       right, top - 0.25,  front,
       right, middle, front - 1.0,
       right, bottom + 0.25, front, //67

       left, middle, front - 1.0,
       right, middle, front - 1.0,
       right, top - 0.25,  front,
      left,  top - 0.25,  front, // 71

      left, middle, front - 1.0,
      right, middle, front - 1.0,
      right, bottom + 0.25,  front,
      left, bottom + 0.25,  front, // 75
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
