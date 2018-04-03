class _Assets_ {
    constructor() {
        this.models = new Map();
        this.sounds = new Map();
    }

    addSound(name, filepath) {
        this.sounds[name] = new Howl({
            src: [filepath]
        });
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