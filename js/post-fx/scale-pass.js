class ScalePass extends RenderPass {
    constructor(glContext) {
        super(glContext, "assets/shaders/post-vertex.glsl", "assets/shaders/post-scale-fragment.glsl", "SCALE");
        this.resolution = [1024, 1024];
    }

    setUniforms() {
        this.ctx.uniform2f(
            this.passProgram.uniformLocation("u_resolution"),
            this.resolution[Math.X],
            this.resolution[Math.Y]
        );
        super.setUniforms();
    }
}