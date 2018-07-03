class RenderingStage {
    constructor(idx, ctx) {
        this.renderingIndex = idx;
        this.renderingContext = ctx;
        this.renderScene = null;
    }

    render(scene) {
        this.renderScene = scene;
    }
}