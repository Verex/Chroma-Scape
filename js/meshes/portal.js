var PortalMesh = () => {
    var faceColors = [
        [1.0,  1.0,  1.0,  1.0],    // Front face: white
    ];
    var vertices = [];
    var indices = [];
    //indices.push(0);
    
    for(var i = 0; i <= 6; i++){
      var degree_offset = i * 60.0;
      var radian_offset = degree_offset * (Math.PI / 180.0);
      var x_pos = 0.5*Math.cos(radian_offset);
      var y_pos = 0.5*Math.sin(radian_offset);

      vertices.push(x_pos, y_pos, 1);
      vertices.push(x_pos, y_pos, -1);
    }
    return {
        indices: () => { return undefined; },
        vertices: () => { return vertices; },
        color: (portalColor) => {
            var c = [];
            for(var j = 0; j < vertices.length / 3; ++j) {
                const color = (portalColor !== undefined) ? portalColor : faceColors[0];
                c = c.concat(color, color, color, color);
            }
            return c;
        }
    };
};
