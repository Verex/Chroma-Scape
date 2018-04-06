class UIPass extends RenderPass {
    constructor(glContext) {
        super(glContext, "assets/shaders/post-vertex.glsl", "assets/shaders/post-ui-fragment.glsl", "UI");
    }

    setUniforms() {
        super.setUniforms();
        var gl = this.ctx;
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.sceneTexture);

        // Set the parameters so we can render any size image.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        var ui_location = this.passProgram.uniformLocation("u_image");
        var scene_location = this.passProgram.uniformLocation("u_scene");

        gl.uniform1i(ui_location, 0);
        gl.uniform1i(scene_location, 1);
        gl.activeTexture(gl.TEXTURE0);
    }
}