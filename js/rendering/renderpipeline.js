/*
    Rendering pipeline class
    A rendering pipeline will be extended to describe how
    objects in our game will be rendered to the screen
*/

class RenderingPipeline {
    constructor(glContext) {
        this.stages = [];
        this.renderingContext = glContext;
        this.renderProgram = new Program.Builder(glContext).
        withShaderSource("assets/shaders/vertex.glsl", glContext.VERTEX_SHADER, "VERTEX").
        withShaderSource("assets/shaders/fragment.glsl", glContext.FRAGMENT_SHADER, "FRAGMENT").
        build();
        this.renderTargets = [];
        this.renderTargets[0] = new RenderTarget(glContext, glContext.canvas.width, glContext.canvas.height, true, true); //This is our render target
        this.stages[0] = new GeometryStage(this.renderingContext);
        this.viewport = new Viewport(glContext, 50, 50, glContext.canvas.width - 100, glContext.canvas.height - 100);
    }

    onResize() {
        this.renderTargets[0] = new RenderTarget(this.renderingContext, this.renderingContext.canvas.width, this.renderingContext.canvas.height, true, true); //This is our render target
        this.viewport = new Viewport(this.renderingContext, 50, 50, this.renderingContext.canvas.width - 100, this.renderingContext.canvas.height - 100);
    }

    processScene(scene) {
        var clearColor = DARK;
        this.renderingContext.clearColor(clearColor.r, clearColor.g, clearColor.b, clearColor.a);
        this.renderingContext.enable(this.renderingContext.DEPTH_TEST);
        this.renderingContext.clear(this.renderingContext.COLOR_BUFFER_BIT | this.renderingContext.DEPTH_BUFFER_BIT);
        this.viewport.bind(); //Bind our viewport
        this.renderProgram.activate(); //Activate our rendering program
        var activeCamera = scene.activeCamera;
        if(activeCamera === undefined) return;
        this.renderingContext.uniformMatrix4fv(
            this.renderProgram.uniformLocation("u_projectionMatrix"),
            false,
            activeCamera.projectionMatrix
        );

        this.renderingContext.uniformMatrix4fv(
            this.renderProgram.uniformLocation("u_viewMatrix"),
            false,
            activeCamera.sceneNode.worldMatrix
        );
        var rootElement = scene.rootNode.ent;
        for(var i = 0; i < this.stages.length; i++) {
            var stage = this.stages[i];
            stage.render(rootElement, this.renderProgram, activeCamera);
        }
    }
}
