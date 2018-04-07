class RenderPass {
    constructor(glContext, vtx, fgmt, name) {
        this.ctx = glContext;
        this.name = name;
        this.passProgram = new Program.Builder(glContext).
            withShader(vtx, glContext.VERTEX_SHADER, name + "-vtx").
            withShader(fgmt, glContext.FRAGMENT_SHADER, name + "-fgmt").
            build();
    }

    setUniforms() {

    }

    doPass(viewport) {
        this.passProgram.activate();

        var positionLocation = this.passProgram.attributeLocation("a_position");
        var texcoordLocation = this.passProgram.attributeLocation("a_texCoord");

        this.setUniforms();

        this.ctx.enableVertexAttribArray(positionLocation);

        // Bind the position buffer.
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, viewport.posBuffer);
      
        // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var size = 2;          // 2 components per iteration
        var type = this.ctx.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        this.ctx.vertexAttribPointer(
            positionLocation, size, type, normalize, stride, offset);
        this.ctx.enableVertexAttribArray(texcoordLocation);
        // Bind the position buffer.
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, viewport.texCoordBuffer);  
        // Tell the position attribute how to ge t data out of positionBuffer (ARRAY_BUFFER)
        var size = 2;          // 2 components per iteration
        var type = this.ctx.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        this.ctx.vertexAttribPointer(
            texcoordLocation, size, type, normalize, stride, offset);
        viewport.render();
    }
};