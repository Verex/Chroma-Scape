class ScanlinePass extends RenderPass {
    constructor(glContext) {
        super(glContext, "assets/shaders/post-vertex.glsl", "assets/shaders/post-scanline-fragment.glsl", "SCANLINE");
    }

    setUniforms() {
        var timeLocation = this.passProgram.uniformLocation("Time");
        var time =  GlobalVars.getInstance().curtime;
        this.ctx.uniform1f(timeLocation, time);
        super.setUniforms();
    }
}