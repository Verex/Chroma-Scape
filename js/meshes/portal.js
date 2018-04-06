var PortalMesh = () => {
    const top = 1,
          bottom = -1,
          left = -1,
          right = 1,
          front = -1,
          back = 1;

    const faceColors = [
        VertexColor.new([1.0,  0.0,  1.0,  1.0], 14),
        VertexColor.new([0.094, 0.09, 0.086, 1.0], 24)
    ];
    var indices = [
      6, 0, 1,
      6, 0, 2,
      6, 2, 3,
      6, 3, 4,
      6, 4, 5,
      6, 5, 1,

      13, 7, 8,
      13, 7, 9,
      13, 9, 10,
      13, 10, 11,
      13, 11, 12,
      13, 12, 8,

      // top border
      14, 15, 16,     14, 16, 17,
      18, 19, 20,     18, 20, 21,

      14, 15, 18,     18, 19, 15,
      16, 17, 20,     17, 20, 21,

      // left - top border
      17, 22, 23,     17, 14, 23,
      21, 24, 25,     21, 18, 25,

      22, 17, 21,     22, 21, 24,
      23, 14, 18,     23, 18, 25,

      // Bottom border
      26, 27, 28,     26, 28, 29,
      30, 31, 32,     30, 32, 33,

      26, 27, 30,     30, 31, 27,
      28, 29, 32,     29, 32, 33,

      // left - bottom border
      23, 29, 22,     23, 29, 26,
      25, 33, 24,     25, 33, 30,

      23, 26, 30,     23, 30, 25,
      22, 29, 33,     22, 33, 25,

      28, 34, 35,     27, 28, 35,
      32, 36, 37,     31, 37, 32,
      34, 36, 32,     32, 34, 28,
      35, 37, 31,     35, 31, 27,

      16, 34, 35,     16, 15, 35,
      20, 19, 36,     19, 36, 37,

      20, 16, 36,     36, 16, 34,
      15, 19, 37,     15, 35, 37,
    ];
    var vertices = [
      // Front portal.
      left * 0.5, top, front * 0.5,
      right * 0.5, top, front * 0.5,
      left, 0.0, front * 0.5, // 2
      left * 0.5, bottom, front * 0.5,
      right * 0.5, bottom, front * 0.5, // 4
      right, 0.0, front * 0.5, // 5
      0.0, 0.0, front * 0.5,  // 6

      // Back portal.
      left * 0.5, top, back * 0.5, // 7
      right * 0.5, top, back * 0.5,
      left, 0.0, back * 0.5, // 9
      left * 0.5, bottom, back * 0.5,
      right * 0.5, bottom, back * 0.5, // 11
      right, 0.0, back * 0.5, // 12
      0.0, 0.0, back * 0.5,  // 13

      // Portal outer
      left * 0.5 - 0.25, top + 0.25, back, // 14
      right * 0.5 + 0.25, top + 0.25, back,
      right * 0.5, top, back, // 16
      left * 0.5, top, back, // 17

      left * 0.5 - 0.25, top + 0.25, front, // 18
      right * 0.5 + 0.25, top + 0.25, front,
      right * 0.5, top, front, // 20
      left * 0.5, top, front, // 21

      left, 0.0, back, // 22
      left - 0.25, 0.0, back,
      left, 0.0, front, // 24
      left - 0.25, 0.0, front,

      left * 0.5 - 0.25, bottom - 0.25, back, // 26
      right * 0.5 + 0.25, bottom - 0.25, back,
      right * 0.5, bottom, back, // 28
      left * 0.5, bottom, back, // 29

      left * 0.5 - 0.25, bottom - 0.25, front, // 30
      right * 0.5 + 0.25, bottom - 0.25, front,
      right * 0.5, bottom, front, // 32
      left * 0.5, bottom, front, // 33

      right, 0.0, back, // 34
      right + 0.25, 0.0, back,
      right, 0.0, front, // 36
      right + 0.25, 0.0, front,
    ];
    return {
        indices: () => { return indices; },
        vertices: () => { return vertices; },
        color: () => {
          var c = [];
          for(var j = 0; j < faceColors.length; ++j) {
              c = c.concat(faceColors[j].getData());
          }
          return c;
        }
    };
};
