var ShaderParser = () => {
    return {
        /*
            Function: parseShaderFile
            Parameters: @srcFile - String: the filepath on the server for the shader file
            Purpose: 
                This function parses the shader file from the .glsl file that was passed to our program
        */
        parseShaderFile: (srcFile) => {
            var data = null;
            $.ajax({
                url: srcFile,
                async: false,
                success: (resultData, textStatus, xhr) => { 
                    console.log("[SHADER]: Loaded: " + srcFile + " status: (" + xhr.status + ")" + textStatus);
                    data = resultData; 
                },
                error: (msg) => { console.error("You don screwed up! ");} 
            });
            return data;
        }
    };
};
var ProgramStatus = {
    PROGRAM_OK: 0,
    PROGRAM_VTXSHADER_FAIL: 1,
    PROGRAM_FGTSHADER_FAIL: 2,
    PROGRAM_OTHER_FAIL: 3
};
class Shader {
    constructor(glContext, source, type) {
        this.ctx = glContext;
        this.source = source;
        this.type = type;
    }

    /*
        Function: Compile
        Parameters: void
        Purpose:
            The compile function compiles the inner shader with the supplied code
            If the compilation is successful return the compiled shader
            If the compilation fails return undefined
    */
    compile() {
        var s = this.ctx.createShader(this.type);
        this.ctx.shaderSource(s, this.source);
        this.ctx.compileShader(s);
        var success = this.ctx.getShaderParameter(s, this.ctx.COMPILE_STATUS);
        if (success) {
            console.log("[SHADER]: Compile status: OK");
            return s;
        }
        console.error(this.ctx.getShaderInfoLog(s));
        return undefined;
    }
}
class Program {
    constructor(builder) {
        if(arguments.length === 1) {
            let ctx = builder.ctx;
            let shaders = builder.shaders;
            let innerProgram = ctx.createProgram();
            let uniforms = new Map();
            let attributes = new Map();
            this.link(shaders, ctx, innerProgram);
            let numUniforms = ctx.getProgramParameter(innerProgram, ctx.ACTIVE_UNIFORMS);
            let numAttributes = ctx.getProgramParameter(innerProgram, ctx.ACTIVE_ATTRIBUTES);
            var max = Math.max(numUniforms, numAttributes);
            for(let i = 0; i < max; i++) { //Store all of our attributes & uniforms
                if(i < numAttributes) {
                    const info = ctx.getActiveAttrib(innerProgram, i);
                    attributes.set(
                        info.name,
                        ctx.getAttribLocation(innerProgram, info.name)
                    );
                }
                if(i < numUniforms) {
                    const info = ctx.getActiveUniform(innerProgram, i);
                    uniforms.set(
                        info.name,
                        ctx.getUniformLocation(innerProgram, info.name)
                    );
                }
            }
            /*
                Object defineProperties
                define the properties of this object type
                Set writable flag to false to prevent modification post creation
            */
            Object.defineProperties(this, {
                '_ctx':{
                    value:ctx,
                    writable:false
                },
                '_innerProgram':{
                    value:innerProgram,
                    writable:false
                },
                '_shaders':{
                    value:shaders,
                    writable:false
                },
                '_numUniforms':{
                    value:numUniforms,
                    writable:false
                },
                '_numAttributes':{
                    value:numAttributes,
                    writable:false
                },
                '_uniforms':{
                    value:uniforms,
                    writable:false
                },
                '_attributes':{
                    value:attributes,
                    writable:false
                }
            });
        } else {
            console.error("[GL PROGRAM]: ERROR CONSTRUCTING GL PROGRAM! INVALID BUILDER");
            return undefined;
        }
    }
    /*
        Function: link
        Parameters: @shaders - List of shaders to link to the program
                    @ctx - Current webgl context
                    @p   - A reference to the current glProgram
        Purpose:
            The link function is responsible for attaching and compiling all of the shaders with the respective glProgram
    */
    link(shaders, ctx, p) {
        var status = ProgramStatus.PROGRAM_OK;
        shaders.forEach((value, index, array) => {
            var s = value.compile();
            if(s === undefined) {
                switch(value.type) {
                    case ctx.VERTEX_SHADER: 
                        console.error("Vertex Shader Fail");
                        status = ProgramStatus.PROGRAM_VTXSHADER_FAIL;
                        break;
                    case ctx.FRAGMENT_SHADER:
                        console.error("Fragment Shader Fail");
                        status = ProgramStatus.PROGRAM_FGTSHADER_FAIL;
                        break;
                    default:
                        console.error("PROGRAM CRITICAL FAILURE!"); //If this somehow happens we need to just kill execution
                        status = ProgramStatus.PROGRAM_OTHER_FAIL;
                        break;
                }
            } else {
                ctx.attachShader(p, s);
            }
        });
        this.programStatus = status;
        ctx.linkProgram(p);
        var success = ctx.getProgramParameter(p, ctx.LINK_STATUS);
        var info = ctx.getProgramInfoLog(p);
        if(success) {
            console.log("[GLPROGRAM]: Link status: OK");
            return this.innerProgram;
        }
        console.error("[GLPROGRAM]: Link status: " + info);
        ctx.deleteProgram(p);
    }
    activate() {
        this._ctx.useProgram(this._innerProgram);
    }
    attributeLocation(name) {
        return this._attributes.get(name);
    }
    uniformLocation(name) {
        return this._uniforms.get(name);
    }
    static get Builder() {
        /*
            Javascript Builder Design Pattern
            Useful for constructing const instances of a certain object
            In this game we can build glPrograms with specific shaders
        */
        class Builder {
            constructor(glContext) {
                this.ctx = glContext;
                this.shaders = new Map();
            }
            withShader(src, type, name) {
                this.shaders.set(name, new Shader(
                    this.ctx,
                    ShaderParser().parseShaderFile(src),
                    type
                ));
                return this;
            }
            build() {
                return new Program(this);
            }
        }
        return Builder;
    }
};