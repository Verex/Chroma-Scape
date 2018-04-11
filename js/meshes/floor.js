var FloorMesh = () => {
    const faceColors = [
        VertexColor.new([0.0, 0.0, 0.0, 1.0], 4),
    ];
    var indices = [
      0, 1, 2,  0, 2, 3
    ];
    var vertices = [
      -50000.0, 0.0, -50000.0,
      -50000.0, 0.0, 50000.0,
      50000.0, 0.0, 50000.0,
      50000.0, 0.0, -50000.0,
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
