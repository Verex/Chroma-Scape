var AssetParser = () => {
    return {
        /*
            Function: parseShaderFile
            Parameters: @srcFile - String: the filepath on the server for the shader file
            Purpose: 
                This function parses the shader file from the .glsl file that was passed to our program
        */
        parseAssetFile: (srcFile) => {
            var data = null;
            $.ajax({
                url: srcFile,
                async: false,
                success: (resultData, textStatus, xhr) => { 
                    console.log("[ASSETS]: Loaded: " + srcFile + " status: (" + xhr.status + ")" + textStatus);
                    data = resultData; 
                },
                error: (msg) => { console.error("You don screwed up! ");} 
            });
            return data;
        }
    };
};
class _Assets_ {
    constructor() {
        this.models = new Map();
        this.sounds = new Map();
        this.fonts = new Map();
    }

    addFont(name, font) {
        this.fonts[name] = font;
    }

    getFont(name) {
        return this.fonts[name];
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