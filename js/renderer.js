/*
    Renderer class
    A renderer object will be responsible for rendering a scene
    A renderer object should be able to be extended for more specific use
*/
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
        this.ctx.clear(this.ctx.COLOR_BUFFER_BIT | this.ctx.DEPTH_BUFFER_BIT);
    }
    render(gameworld) {
        this.ctx.viewport(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.clear();
        this.program.activate();
    }
}