var PillarMesh = () => {
    const top = 3,
          point = 4,
          bottom = -4,
          left = -1,
          right = 1,
          front = -1,
          back = 1;

    const faceColors = [
        VertexColor.new([1.0,  0.0,  1.0,  1.0], 16),
        VertexColor.new([1.0,  0.2,  1.0,  1.0], 12),
    ];
    var indices = [
      0, 1, 2,   0, 2, 3,

      4, 5, 6,   4, 6, 7,

      8, 9, 10,   8, 10, 11,

      12, 13, 14,   12, 14, 15,

      16, 17, 18,
      19, 20, 21,
      22, 23, 24,
      25, 26, 27,
    ];
    var vertices = [
      left, top, front,
      right, top, front,
      right, bottom, front,
      left, bottom, front,

      left, top, back,
      right, top, back,
      right, bottom, back,
      left, bottom, back,

      left, top, back,
      left, top, front,
      left, bottom, front,
      left, bottom, back,

      right, top, back,
      right, top, front,
      right, bottom, front,
      right, bottom, back, // 15

      left, top, front, // 16
      right, top, front,
      0.0, point, 0.0,

      left, top, back, // 19
      right, top, back,
      0.0, point, 0.0,

      left, top, back, // 22
      left, top, front,
      0.0, point, 0.0,

      right, top, back, // 25
      right, top, front,
      0.0, point, 0.0,
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
