class Shader {
    constructor(type, src, glContext) {
        this.type = type; //Type of shader, Vertex Shader, Fragment Shader
        this.data = ""; //The text data of the .glsl file that was ajax'd in
        this.ctx = glContext; //This is the webgl context
        this.src = src; //Source Filepath
        var self = this;
        $.ajax({
            url: src,
            success: (data, textStatus, xhr) => { 
                console.log("[SHADER]: Loaded: " + src + " status: (" + xhr.status + ")" + textStatus);
                self.data = data; //Store the shader text data
            },
            error: (msg) => { console.error("You don screwed up! ");} 
        });
    }


    /*
        Function: compile
        Parameters: void
        Purpose: This function serves as a wrapper for compiling WebGL shaders and printing an error to the console if something went wrong
        TODO(Any): Maybe we can come up with some more useful error messages if we have some extra time
    */
    compile() {
        var s = this.ctx.createShader(this.type); 
        this.ctx.shaderSource(s, this.data); 
        this.ctx.compileShader(s); 
        var success = this.ctx.getShaderParameter(s, this.ctx.COMPILE_STATUS);
        if (success) {
            console.log("[SHADER]: (" + this.src + "): Compile status: OK");
            return s;
        }
        console.error(this.ctx.getShaderInfoLog(s));
        return undefined;
    }
};