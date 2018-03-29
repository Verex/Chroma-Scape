// TODO: This should not be here ??? Maybe new class file...
class VertexColor {
  constructor(color = [0.0, 0.0, 0.0, 1.0], length = 1){
    this.color = color;
    this.length = length;
  }

  getData() {
    var out = [];
    for (var i = 0; i < this.length; i++) {
      out = out.concat(this.color);
    }

    return out;
  }

  static new(color, length) {
    return new VertexColor(color, length);
  }
}

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
    const thrusterColor = [1.0, 0.0, 1.0, 1.0];

    const faceColors = [
      VertexColor.new(primaryColor, 16),
      VertexColor.new(highlightColor, 6),
      VertexColor.new(shadeColor, 4),
      VertexColor.new(highlightColor, 6),
      VertexColor.new(shadeColor, 4),
      VertexColor.new(shadeColor, 16),
      VertexColor.new(thrusterColor, 4),
      VertexColor.new(primaryColor, 6),
      VertexColor.new(shadeColor, 8)
    ];

    const indices = [
        0,  1,  2,      0,  2,  3,    // front
        3,  4,  5,      2,  3,  5,
        4,  5,  6,      5,  6,  7,

        8,  9, 10,      8,  9, 11, // Left

        12, 13, 14,     12, 14, 15, // Right

        16, 17, 18,     19, 20, 21, // TOP L/R

        22, 23, 24,     22, 24, 25, // Top

        26, 27, 28,      29, 30, 31, // Bottom L/R

        32, 33, 34,      32, 34, 35, // Bottom

        // Main thruster.
        36, 37, 38,      36, 38, 39, // Top

        36, 40, 41,      36, 41, 37, // Left
        38, 42, 43,      38, 43, 39, // Right

        40, 41, 42,      40, 42, 43, // Bottom

        44, 45, 46,      44, 46, 47, // Inner top
        48, 49, 50,      48, 50, 51, // Inner bottom
        44, 48, 49,      44, 49, 45, // Inner left

        46, 50, 51,      46, 51, 47, // Inner right
        37, 45, 46,      37, 46, 38, // Front top
        41, 49, 50,      41, 50, 42, // Front bottom
        37, 45, 49,      37, 49, 41, // Front Left
        38, 46, 50,      38, 50, 42, // Front bottom

        52, 53, 54,      52, 54, 55, // Thruster inner

        56, 57, 58,     59, 60, 61, // Front sides
        62, 63, 64,      62, 64, 65, // Front top
        66, 67, 68,       66, 68, 69, // Front bottom
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
        -0.25,  top,  back, // 16
        left,  top - 0.25,  back,
        left,  top - 0.25,  front,

        // Right top panel.
        right,  top - 0.25,  front, // 19
        right,  top - 0.25,  back,
        0.25,  top,  back,

        // Top panel.
       -0.25,  top,  back, // 22
        left,  top - 0.25,  front,
        right, top - 0.25,  front,
        0.25,  top,  back, // 25

        // Left bottom panel.
        left, bottom + 0.25,  back, // 26
        left, bottom + 0.25, front,
        -0.25, bottom, back, // 28

        // Right bottom panel.
        right, bottom + 0.25,  back, // 29
        right, bottom + 0.25, front,
        0.25, bottom, back, // 31

        // Bottom panel.
        -0.25, bottom,  back, // 32
         left, bottom + 0.25,  front,
         right, bottom + 0.25,  front,
         0.25, bottom,  back, // 35

       // Thruster top
       left, top - 0.25, back, // 36
       left, top - 0.25, back + 0.25,
       right, top - 0.25, back + 0.25,
       right, top - 0.25, back, // 39

      // Thruster bottom
      left, bottom + 0.25, back, // 40
      left, bottom + 0.25, back + 0.25,
       right, bottom + 0.25, back + 0.25,
       right, bottom + 0.25, back, // 44

     // Thruster inner top
     left + 0.1, top - 0.25 - 0.1, back, // 44
     left + 0.1, top - 0.25 - 0.1, back + 0.25,
     right - 0.1, top - 0.25 - 0.1, back + 0.25,
     right - 0.1, top - 0.25 - 0.1, back, // 47

      // Thruster inner bottom
      left + 0.1, bottom + 0.25 + 0.1, back, // 48
      left + 0.1, bottom + 0.25 + 0.1, back + 0.25,
      right - 0.1, bottom + 0.25 + 0.1, back + 0.25,
      right - 0.1, bottom + 0.25 + 0.1, back, // 51

       // Thruster inner.
       left + 0.1, bottom + 0.25 + 0.1, back + (0.25 * 0.5), // 52
       left + 0.1, top - 0.25 - 0.1, back + (0.25 * 0.5),
       right - 0.1, top - 0.25 - 0.1, back + (0.25 * 0.5),
       right - 0.1, bottom + 0.25 + 0.1, back + (0.25 * 0.5), // 55

       // Front left
       left, bottom + 0.25, front, // 56
       left,  top - 0.25,  front,
       left, middle, front - 1.0, //58

       right, bottom + 0.25, front, // 59
       right, top - 0.25,  front,
       right, middle, front - 1.0, //61

       left, middle, front - 1.0, // 62
       right, middle, front - 1.0,
       right, top - 0.25,  front,
      left,  top - 0.25,  front, // 65

      left, middle, front - 1.0, // 66
      right, middle, front - 1.0,
      right, bottom + 0.25,  front,
      left, bottom + 0.25,  front, // 69
    ];

    return {
        indices: () => { return indices; },
        vertices: () => { return vertices; },
        color: () => {
            var c = [];
            for(var j = 0; j < faceColors.length; ++j) {
                c = c.concat(faceColors[j].getData());
            }
            console.log(c.length);
            return c;
        }
    };
};
