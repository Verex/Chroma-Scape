class _SceneManager_ {
    constructor() {
        this.scenes = [];
        this.activeScene = null;
    }
    loadScene(filePath, onLoad) {
        var sceneBuilder = new Scene.Builder();
        var scene = sceneBuilder.fromSceneFile(filePath).build();
        this.scenes.push(scene);
            if(onLoad) {
            onLoad(this, scene);
        }
    }
}
var SceneManager = (() => {
    var instance;
    return {
        getInstance: () => {
            if(instance == null) {
                instance = new _SceneManager_();
            }
            return instance;
        }
    }
})();