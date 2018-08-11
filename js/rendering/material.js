class Material {
    constructor(glContext, shaders, passes) {
        this.renderingContext = glContext;
        this.shaders = shaders;
        this.passes = passes;

        for(var i = 0; i < this.shaders.length; i++) {
            this.shaders[i] = Assets.getInstance().getShader(this.shaders[i]);
            if(this.shaders[i] )
        }
    }

}