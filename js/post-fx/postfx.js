class PostFX {
    constructor(ctx, target) {
        this.ctx = ctx;
        this.renderTarget = target;
    }

    setEffectShader(name) {
        var shader = Assets.getInstance().getShader(name);
        var programBuilder = new Program.Builder(this.ctx);
        if(shader.Vertex !== undefined) {
            programBuilder.withShader(name + "-vtx", shader.Vertex);
        }
        if(shader.Fragment !== undefined) {
            programBuilder.withShader(name + "-fgmt", shader.Fragment);
        }
        this.program = programBuilder.build();
    }

    doEffect(src, viewport) {
        this.program.activate();

        if(src !== undefined && src !== null) {
            src.bindTexture();
        }
        if(this.renderTarget !== null) {
            this.renderTarget.bind();
        } else {
            this.ctx.bindFramebuffer(this.ctx.FRAMEBUFFER, null);
        }
        var positionLocation = this.program.attributeLocation("a_position");
        var texcoordLocation = this.program.attributeLocation("a_texCoord");
        var screenSizeLocation = this.program.uniformLocation("u_screenSize");
        var timeLocation = this.program.uniformLocation("u_time");
        if(timeLocation !== undefined) {
            this.ctx.uniform1f(
                timeLocation,
                GlobalVars.getInstance().curtime
            );
        }

        this.ctx.uniform2f(screenSizeLocation, viewport.width, viewport.height);

        
        this.ctx.enableVertexAttribArray(positionLocation);

        // Bind the position buffer.
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, viewport.posBuffer);
      
        // Tell thep position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
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