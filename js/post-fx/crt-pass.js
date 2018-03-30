class CRTPass extends RenderPass {
    constructor(glContext) {
        super(glContext, "assets/shaders/post-vertex.glsl", "assets/shaders/post-fragment.glsl", "CRT");
    }

    setUniforms() {
        this.ctx.uniform2f(
            this.passProgram.uniformLocation("dim"),
            this.ctx.canvas.width - 100,
            this.ctx.canvas.height - 100
        );

        super.setUniforms();
    }
}