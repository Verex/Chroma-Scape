class Model {
    constructor(glContext, indices, vertices, color) {
        this.ctx = glContext;
        this.indices = indices;
        this.vertices = vertices;
        this.color = color;

        this.vtxBuffer = glContext.createBuffer();
        this.idxBuffer = glContext.createBuffer();
        this.clrBuffer = glContext.createBuffer();

        glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vtxBuffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(this.vertices), glContext.STATIC_DRAW);
        glContext.bindBuffer(glContext.ARRAY_BUFFER, this.clrBuffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(this.color), glContext.STATIC_DRAW);
        glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.idxBuffer);
        glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), glContext.STATIC_DRAW);
    }
};