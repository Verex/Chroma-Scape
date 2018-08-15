class RenderTarget {
    constructor(glContext, width, height, depth = false, clamp = false) {
        this.frameBuffer = glContext.createFramebuffer();
        this.texture = glContext.createTexture();
        this.depthBuffer = glContext.createRenderbuffer();
        this.ctx = glContext;
        this.width = width;
        this.height = height;

        glContext.bindTexture(glContext.TEXTURE_2D, this.texture);
        glContext.texImage2D(glContext.TEXTURE_2D, 0, glContext.RGBA, width, height, 0, glContext.RGBA, glContext.UNSIGNED_BYTE, null);
        if(clamp) {
            glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_S, glContext.CLAMP_TO_EDGE);
            glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_T, glContext.CLAMP_TO_EDGE);
            glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.LINEAR);
        }

        if(depth) {
            glContext.bindRenderbuffer(glContext.RENDERBUFFER, this.depthBuffer);
            glContext.renderbufferStorage(glContext.RENDERBUFFER, glContext.DEPTH_COMPONENT16, width, height);
        }

        glContext.bindFramebuffer(glContext.FRAMEBUFFER, this.frameBuffer);
        glContext.framebufferTexture2D(glContext.FRAMEBUFFER, glContext.COLOR_ATTACHMENT0, glContext.TEXTURE_2D, this.texture, 0);
        if(depth) {
            glContext.framebufferRenderbuffer(glContext.FRAMEBUFFER, glContext.DEPTH_ATTACHMENT, glContext.RENDERBUFFER, this.depthBuffer);
        }

        glContext.bindFramebuffer(glContext.FRAMEBUFFER, null);
        glContext.bindTexture(glContext.TEXTURE_2D, null);
        glContext.bindRenderbuffer(glContext.RENDERBUFFER, null);
    }
    clear(color = BLACK) {
        //this.ctx.colorMask(false, false, false, true);
        this.ctx.clearColor(color.r, color.g, color.b, color.a);
        this.ctx.enable(this.ctx.DEPTH_TEST);
        this.ctx.clear(this.ctx.COLOR_BUFFER_BIT | this.ctx.DEPTH_BUFFER_BIT);
    }

    bind() {
        this.ctx.bindFramebuffer(this.ctx.FRAMEBUFFER, this.frameBuffer);
        this.ctx.viewport(0, 0, this.width, this.height);
    }

    bindTexture() {
        this.ctx.bindTexture(this.ctx.TEXTURE_2D, this.texture);
    }
}