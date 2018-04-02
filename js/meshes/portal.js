var PortalMesh = () => {
    const top = 1,
          bottom = -1,
          left = -1,
          right = 1,
          front = -1,
          back = 1;

    const faceColors = [
        VertexColor.new([1.0,  0.0,  1.0,  1.0], 14)
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
      left, 0.0, front * 0.5, // 9
      left * 0.5, bottom, back * 0.5,
      right * 0.5, bottom, back * 0.5, // 11
      right, 0.0, back * 0.5, // 12
      0.0, 0.0, back * 0.5,  // 13
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
