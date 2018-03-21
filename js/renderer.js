/*
    Renderer class
    A renderer object will be responsible for rendering a scene
    A renderer object should be able to be extended for more specific use
*/
var z = 0;
class Renderer {
    constructor(glContext) {
        this.ctx = glContext;
        this.program = new Program.Builder(glContext).
               withShader("assets/shaders/vertex.glsl", glContext.VERTEX_SHADER, "VERTEX").
               withShader("assets/shaders/fragment.glsl", glContext.FRAGMENT_SHADER, "FRAGMENT").
               build();
    }
    clear(color = BLACK) {
        this.ctx.clearColor(color.r, color.g, color.b, color.a);
        this.ctx.enable(this.ctx.DEPTH_TEST);
        this.ctx.clear(this.ctx.COLOR_BUFFER_BIT | this.ctx.DEPTH_BUFFER_BIT);
    }
    render(gameworld) {
        this.ctx.viewport(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.clear();
        this.program.activate();

        this.ctx.uniformMatrix4fv(
            this.program.uniformLocation("u_projectionMatrix"),
            false,
            gameworld.scene.cameras[0].projectionMatrix
        );

        this.ctx.uniformMatrix4fv(
            this.program.uniformLocation("u_viewMatrix"),
            false,
            gameworld.scene.cameras[0].sceneNode.worldMatrix
        );

        var testent = gameworld.children[0];
        var testtransformcomponent = testent.components[ComponentID.COMPONENT_TRANSFORM];
        var testmeshcomponent = testent.components[ComponentID.COMPONENT_MESH];
        testmeshcomponent.render(this.program, this.ctx);
        
        mat4.rotateY(
            testtransformcomponent.localTransform,
            testtransformcomponent.localTransform,
            0.05
        );
    }
}