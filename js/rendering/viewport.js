class Viewport {
    constructor(glContext, x, y, width, height) {
        this.posBuffer = glContext.createBuffer();
        this.texCoordBuffer = glContext.createBuffer();
        this.ctx = glContext;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;

        glContext.bindBuffer(glContext.ARRAY_BUFFER, this.posBuffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array([
           -1.0, 1.0,
           1.0, 1.0,
           1.0, -1.0,
           -1.0, 1.0,
           -1.0, -1.0,
           1.0, -1.0,
        ]), glContext.STATIC_DRAW);

        glContext.bindBuffer(glContext.ARRAY_BUFFER, this.texCoordBuffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array([
            0.0,  1.0,
            1.0,  1.0,
            1.0,  0.0,

            0.0,  1.0,
            0.0,  0.0,
            1.0,  0.0
        ]), glContext.STATIC_DRAW);
    }

    bind() {
        this.ctx.viewport(this.x, this.y, this.width, this.height);
    }

    render() {
        var primitiveType = this.ctx.TRIANGLES;
        var offset = 0;
        var count = 6;
        this.ctx.drawArrays(primitiveType, offset, count);
    }
}