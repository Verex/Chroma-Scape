class CurvedPass extends RenderPass {
    constructor(glContext) {
        super(glContext, "assets/shaders/post-vertex.glsl", "assets/shaders/post-curved-fragment.glsl", "CURVED");
    }

    setUniforms() {
        super.setUniforms();
    }
}