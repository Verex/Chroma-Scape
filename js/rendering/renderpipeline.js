/*
    Rendering pipeline class
    A rendering pipeline will be extended to describe how
    objects in our game will be rendered to the screen
*/

class RenderingPipeline {
    constructor(glContext) {
        this.stages = [];
        this.renderingContext = glContext;
        this.stages[0] = new GeometryStage(this.renderingContext);
        this.viewport = new Viewport(glContext, 50, 50, glContext.canvas.width, glContext.canvas.height);
    }

    onResize() {
        for(var i = 0; i < this.stages.length; i++) {
            var stage = this.stages[i];
            stage.onResize();
        }
        this.viewport = new Viewport(this.renderingContext, 50, 50, this.renderingContext.canvas.width, this.renderingContext.canvas.height);
    }

    processScene(scene) {
        this.viewport.bind(); //Bind our viewport
        var activeCamera = scene.activeCamera;
        if(activeCamera === undefined) return;
        var rootElement = scene.rootNode.ent;
        for(var i = 0; i < this.stages.length; i++) {
            var stage = this.stages[i];
            stage.render(rootElement, this.viewport, activeCamera);
        }
    }
}
