var GridMesh = (size, divisions) => {
    var length = 18000, width = 360, height = 600,
    lDivisions = 1800, wDivisions = 36, hDivisions = 60,
    lStep = width / wDivisions, wStep = length / lDivisions, hStep = height / hDivisions,
    halfLength = length / 2, halfWidth = width / 2;

    size = 20;
    divisions = 20;
    var center = divisions / 2;
    var step = size / divisions;
    var halfSize = size / 2 ;
    var vertices = [], colors = [], indices = [];

    var faceColors = [
        [1.0,  0.09,  0.09,  1.0],    // Front face: red
        [0.09,  0.75,  0.91,  1.0],    // Back face: blue
    ];

    // Generate horizontal lines.
    for(var i = 0, k = -halfWidth; i <= wDivisions; i++, k += lStep) {
        vertices.push(
            k, 0, -halfLength,
            k, 0, halfLength,
        );

        var c = faceColors[1];

        colors = colors.concat(c,c);
    }

    // Generate vertical floor lines and vertical wall lines.
    for(var i = 0, k = -halfLength; i <= lDivisions; i++, k += wStep) {
        vertices.push(
            -halfWidth, 0, k,
            halfWidth, 0, k,

            -halfWidth, 0, k,
            -halfWidth, height, k,
            halfWidth, height, k,
            halfWidth, 0, k,
        );

        var c = faceColors[1], c2 = faceColors[0];

        colors = colors.concat( c, c, c2, c2, c2, c2);
    }

    // Generate horizontal wall lines.
    for(var i = 0, k = hStep; i <= wDivisions; i++, k += hStep) {
        vertices.push(
            -halfWidth, k, -halfLength,
            -halfWidth, k, halfLength, 
            halfWidth, k, -halfLength,
            halfWidth, k, halfLength, 
        );

        var c = faceColors[0];

        colors = colors.concat(c, c, c, c);
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
