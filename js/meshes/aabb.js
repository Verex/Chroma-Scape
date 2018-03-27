var AABBMesh = (offsetX, offsetY, offsetZ) => {
    var faceColors = [
        [1.0,  1.0,  1.0,  1.0],    // Front face: white
    ];
    var indices = [
        0,  1,
        2,  3,
        0,  4,  
        5,  6,  
        7,  4,
        5,  1,  
        2,  6, 
        7,  3
    ];
    var vertices = [
        // Front face
        offsetX, offsetY, offsetZ, //Rear upper right - 0
        offsetX, -offsetY, offsetZ,//Rear lower right - 1
        offsetX, -offsetY, -offsetZ, //Front lower right - 2
        offsetX, offsetY, -offsetZ, //Front upper right - 3

        -offsetX, offsetY, offsetZ, //Rear upper left - 4
        -offsetX, -offsetY, offsetZ,//Rear lower left - 5
        -offsetX, -offsetY, -offsetZ, //Front lower left - 6
        -offsetX, offsetY, -offsetZ, //Front upper left - 7
         
    ];
    return {
        indices: () => { return indices; },
        vertices: () => { return vertices; },
        color: () => {
            var c = [];
            for(var j = 0; j < indices.length; ++j) {
                const color = faceColors[0];
                c = c.concat(color, color, color, color);
            }
            return c;
        }
    };
};
