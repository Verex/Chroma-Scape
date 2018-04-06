var PillarMesh = () => {
    const top = 4,
          bottom = 0,
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
      right, bottom, back,
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
