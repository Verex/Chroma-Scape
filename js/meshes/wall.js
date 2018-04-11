var WallMesh = (size, divisions) => {
    var center = divisions / 2;
    var step = size / divisions;
    var halfSize = size / 2 ;
    var vertices = [], colors = [], indices = [];

    var faceColors = [
        [1.0, 0.0, 0.9, 1.0],
        [1.0,  0.0,  1.0,  1.0],
    ];

    var center = [0, 0, 0];
    var r = 1500;
    var it = 100;
    //vertices = vertices.concat(center);

    for (var i = 0; i <= it; i++) {
      var p = [
        center[0] + r * Math.cos(i * 2 * Math.PI/it),
        center[1] + r * Math.sin(i * 2 * Math.PI/it),
        0
      ];
      vertices = vertices.concat(center, p);

      var c = (i % 2 == 0 ? faceColors[1] : faceColors[0]);
      colors = colors.concat(c, c);
    }

    for(var i = 0; i < vertices.length; i++) {
        indices.push(i);
    }
    return {
        indices: () => { return undefined; },
        vertices: () => { return vertices; },
        color: () => { return colors; }
    };
};
