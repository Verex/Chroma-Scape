class _Assets_ {
    constructor() {
        this.models = new Map();
        this.sounds = new Map();
        this.fonts = new Map();
        this.shaders = new Map();
        this.materials = new Map();
    }

    addFont(name, font) {
        this.fonts[name] = font;
    }

    getFont(name) {
        return this.fonts[name];
    }
    addSound(name, sound) {
        this.sounds[name] = sound;
    }

    getSound(name) {
        return this.sounds[name];
    }

    addModel(gl, mesh, name) {
        this.models[name] = new Model(
            gl,
            mesh.indices(),
            mesh.vertices(),
            mesh.color()
        );
    }
    addMaterial(gl, name) {
        var fileName = "assets/materials/" + name + ".json";
        var materialEntry = JSON.parse(Files.getInstance().loadFile(fileName));
        var shaders = materialEntry["Shaders"];
        var passes = materialEntry["Passes"];
        this.materials[name] = new Material(gl, shaders, passes);
    }
    getMaterial(name) {
        return this.materials[name];
    }
    getShader(name) {
        return this.shaders[name];
    }
    addShader(gl, name) {
        var fileName = "assets/shaders/" + name + ".json";
        var shaderEntry = JSON.parse(Files.getInstance().loadFile(fileName));
        this.shaders[name] = {};
        if(shaderEntry["Fragment"] !== undefined) {
            var fragmentShader = shaderEntry["Fragment"]["name"];
            var fragmentType = shaderEntry["Fragment"]["type"];
            var fragmentPath = "assets/shaders/" + fragmentShader + "." + fragmentType;
            this.shaders[name]["Fragment"] = new Shader(
                gl,
                Files.getInstance().loadFile(fragmentPath, "SHADER"),
                gl.FRAGMENT_SHADER
            );
        }
        if(shaderEntry["Vertex"] !== undefined) {
            var vertexShader = shaderEntry["Vertex"]["name"];
            var vertexType = shaderEntry["Vertex"]["type"];
            var vertexPath = "assets/shaders/" + vertexShader + "." + vertexType;
            this.shaders[name]["Vertex"] = new Shader(
                gl,
                Files.getInstance().loadFile(vertexPath, "SHADER"),
                gl.VERTEX_SHADER
            )
        }
    }

    getModel(name) {
        return this.models[name];
    }
};
var Assets = (function(){
    var instance;
    return {
        getInstance: function(){
            if (null == instance) {
                instance = new _Assets_();            
                instance.constructor = null; 
            }
            return instance; 
        }
   };
})();