class UIPass extends RenderPass {
    constructor(glContext) {
        super(glContext, "assets/shaders/post-vertex.glsl", "assets/shaders/post-ui-fragment.glsl", "UI");
        this.canvasTexture = null;
    }

    setupTexture(canvas, textureUnit, program, uniformName) {
        var tex = gl.createTexture();
     
        this.updateTextureFromCanvas(tex, canvas, textureUnit);
     
        // Set the parameters so we can render any size image.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
     
        var location = gl.getUniformLocation(program, uniformName);
        gl.uniform1i(location, textureUnit);
     }
     
     updateTextureFromCanvas(tex, canvas, textureUnit) {
       gl.activeTexture(gl.TEXTURE0 + textureUnit);
       gl.bindTexture(gl.TEXTURE_2D, tex);
       gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
     }

    setUniforms() {
        super.setUniforms();

        var gl = this.ctx;
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.canvasTexture);

        // Set the parameters so we can render any size image.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        var ui_location = this.passProgram.uniformLocation("u_ui");
        var scene_location = this.passProgram.uniformLocation("u_scene");
    }
}