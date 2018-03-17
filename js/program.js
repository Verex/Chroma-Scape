class Program {
    constructor(glContext) {
        this.ctx = glContext;
        this.innerProgram = glContext.createProgram();
        self = this;
        this.shaders = new Map(); //Hashmap of all of our attached shaders
    }

    attachShader(shader) {
        self.ctx.attachShader(this.innerProgram, shader);
    }

    /*
        Function: attachAndLink
        Parameters: void
        Purpose: This function will loop through all of it's shaders and then compile and link them.
    */
    attachAndLink() {
        var p = this.innerProgram;
        this.shaders.forEach((value, index, array) => {
            self.ctx.attachShader(p, value.compile());
        });

        this.link();
    }

    enable() {
        this.ctx.useProgram(this.innerProgram);
    }

    //Wrappers for WebGL Shader Uniform/Attribute Manipulation    
    getAttributeLocation(name) {
        return this.ctx.getAttribLocation(this.innerProgram, name);
    }
    getUniformLocation(name) {
        return this.ctx.getUniformLocation(this.innerProgram, name);
    }

    /*
        Function: link
        Parameters: @cleanup - boolean: If true, the function will delete the created program upon linkage failure, this is to prevent memory leaks
    */
    link(cleanup = true) {
        this.ctx.linkProgram(this.innerProgram);
        var success = this.ctx.getProgramParameter(this.innerProgram, this.ctx.LINK_STATUS);
        var info = this.ctx.getProgramInfoLog(this.innerProgram);
        if(success) {
            console.log("[GLPROGRAM]: Link status: OK");
            return this.innerProgram;
        }
        console.error("[GLPROGRAM]: Link status: " + info);
        if(cleanup) {
            this.ctx.deleteProgram(this.innerProgram);
        }
    }
};