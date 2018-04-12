class Model {
    constructor(glContext, indices, vertices, color) {
        this.ctx = glContext;
        this.indices = indices;
        this.vertices = vertices;
        this.color = color;

        this.vtxBuffer = glContext.createBuffer();
        this.clrBuffer = glContext.createBuffer();

        this.drawType = this.ctx.TRIANGLES;

        this.numVertices = this.vertices.length / 3;


        this.max = vec3.fromValues(-9999, -9999, -9999);
        this.min = vec3.fromValues(9999, 9999, 9999);

        this.reload();
    }

    reload() {
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.vtxBuffer);
        this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(this.vertices), this.ctx.STATIC_DRAW);
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.clrBuffer);
        this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(this.color), this.ctx.STATIC_DRAW);


        if(this.indices) {
            this.idxBuffer = this.ctx.createBuffer();
            this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, this.idxBuffer);
            this.ctx.bufferData(this.ctx.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.ctx.STATIC_DRAW);
        }
        
        for(var i = 0; i < this.vertices.length / 3; i++) {
            var vtx = [
                this.vertices[i],
                this.vertices[i + 1],
                this.vertices[i + 2]
            ];
            if(vtx[Math.X] < this.min[Math.X] && vtx[Math.Y] < this.min[Math.Y] && vtx[Math.Z] < this.min[Math.Z]) {
                this.min = vec3.fromValues(
                    vtx[0], vtx[1], vtx[2]
                );
            }
            if(vtx[Math.X] > this.max[Math.X] && vtx[Math.Y] > this.max[Math.Y] && vtx[Math.Z] > this.max[Math.Z]) {
                this.max = vec3.fromValues(
                    vtx[0], vtx[1], vtx[2]
                );
            }
        }
    }

    render(program) {
        {
            const numComponents = 3;
            const type = this.ctx.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.vtxBuffer);
            this.ctx.vertexAttribPointer(
                program.attributeLocation("a_position"),
                numComponents,
                type,
                normalize,
                stride,
                offset
            );
            this.ctx.enableVertexAttribArray(
                program.attributeLocation("a_position")
            );
        }
        {
            const numComponents = 4;
            const type = this.ctx.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.clrBuffer);
            this.ctx.vertexAttribPointer(
                program.attributeLocation("a_color"),
                numComponents,
                type,
                normalize,
                stride,
                offset
            );
            this.ctx.enableVertexAttribArray(
                program.attributeLocation("a_color")
            );
        }
    }
};