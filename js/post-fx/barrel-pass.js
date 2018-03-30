class BarrelPass extends RenderPass {
    constructor(glContext) {
        super(glContext, "assets/shaders/post-vertex.glsl", "assets/shaders/post-barrel-fragment.glsl", "Barrel");
    }

    setUniforms() {
        super.setUniforms();
    }
}