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

        glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vtxBuffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(this.vertices), glContext.STATIC_DRAW);
        glContext.bindBuffer(glContext.ARRAY_BUFFER, this.clrBuffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(this.color), glContext.STATIC_DRAW);


        if(indices) {
            this.idxBuffer = glContext.createBuffer();
            glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.idxBuffer);
            glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), glContext.STATIC_DRAW);
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