class Material {
    constructor(glContext, shaders, passes) {
        this.renderingContext = glContext;
        this.shaders = shaders;
        this.passes = passes;
        this.renderPrograms = [];

        for(var i = 0; i < this.shaders.length; i++) {
            this.shaders[i] = Assets.getInstance().getShader(this.shaders[i]);
            var shader = this.shaders[i];
            var programBuilder = new Program.Builder(this.renderingContext);
            if(shader.Vertex !== undefined) {
                programBuilder.withShader("Test-Vtx", shader.Vertex);
            }
            if(shader.Fragment !== undefined) {
                programBuilder.withShader("Test-Fmt", shader.Fragment);
            }
            this.renderPrograms[i] = programBuilder.build();
        }
    }

    getUniform(name) {
        var passNames = Object.keys(this.passes);
        var ret = {};
        for(var i = 0; i < this.renderPrograms.length; i++) {
            var program = this.renderPrograms[i];
            var location = program.uniformLocation(name);
            if(location !== undefined) {
                ret[passNames[i]] = location;
            }
        }
    }
}