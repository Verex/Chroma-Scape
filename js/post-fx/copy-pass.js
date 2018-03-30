class CopyPass extends RenderPass {
    constructor(glContext) {
        super(glContext, "assets/shaders/post-vertex.glsl", "assets/shaders/post-copy-fragment.glsl", "COPY");
    }

    setUniforms() {
        super.setUniforms();
    }
}