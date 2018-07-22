class RenderingStage {
    constructor(ctx) {
        this.renderingContext = ctx;
    }

    render(root, program) {
        this.rootEntity = root;
    }
}