var GridMesh = (size, divisions) => {
    var center = divisions / 2;
    var step = size / divisions;
    var halfSize = size /2 ;
    var vertices = [], colors = [], indices = [];

    var faceColors = [
        [1.0,  1.0,  1.0,  1.0],    // Front face: white
        [1.0,  0.0,  0.0,  1.0],    // Back face: red
    ];

    for(var i = 0, j = 0, k = -halfSize; i <= divisions; i++, k += step) {
        vertices.push(
            -halfSize, 0, k, 
            halfSize,0, k, 
            k, 0, -halfSize,
            k, 0, halfSize
        );

        var c = i === center ? faceColors[0] : faceColors[1];

        colors = colors.concat(c,c,c,c);
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
