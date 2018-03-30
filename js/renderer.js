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

        this.renderTargets = [];
        this.renderTargets[0] = new RenderTarget(glContext, glContext.canvas.width, glContext.canvas.height, true, true); //This is our render target
        this.renderTargets[1] = new RenderTarget(glContext, glContext.canvas.width, glContext.canvas.height, false, true);
        this.renderTargets[2] = new RenderTarget(glContext, glContext.canvas.width, glContext.canvas.height, false, true);
        this.viewport = new Viewport(glContext, 50, 50, glContext.canvas.width - 100, glContext.canvas.height - 100);

        this.renderPasses = [
            new CopyPass(glContext),
            new CurvedPass(glContext),
            new ScalePass(glContext),
            new BarrelPass(glContext),
            new CRTPass(glContext),
            new ScanlinePass(glContext)
        ];
    }
    clear(color = BLACK) {
        this.ctx.clearColor(color.r, color.g, color.b, color.a);
        this.ctx.enable(this.ctx.DEPTH_TEST);
        this.ctx.clear(this.ctx.COLOR_BUFFER_BIT | this.ctx.DEPTH_BUFFER_BIT);
    }

    recursiveRender(ent) {
      // Render entity's mesh if it exists.
      if (ent.hasComponent(ComponentID.COMPONENT_MESH)) {
        ent.components[ComponentID.COMPONENT_MESH].render(this.program, this.ctx);
      }

      if(ent.hasComponent(ComponentID.COMPONENT_PHYSICS) && drawAABB) {
          var physicsComponent = ent.getComponent(ComponentID.COMPONENT_PHYSICS);
          if(physicsComponent.aabb) {
              physicsComponent.aabb.draw(this.program, this.ctx);
          }
      }

      // Render children.
      if (ent.children.length > 0) {
        ent.children.forEach((child) => {
          this.recursiveRender(child);
        });
      }
    }

    pushTexture() {
        var gl = this.ctx;
        var viewport = this.viewport;
        var renderTargets = this.renderTargets;
        viewport.bind();

        this.renderTargets[0].bindTexture();
        this.renderTargets[1].bind();
        this.renderPasses[0].doPass(this.viewport);
        //this.renderTargets[1].bindTexture();
        //this.renderTargets[0].bindTexture();

        if(postProcessing) {
            for(var i = 1; i < this.renderPasses.length; i++) {
                var ridx = (i % (this.renderTargets.length ));
                this.renderTargets[ridx].bind();
                this.renderPasses[i].doPass(this.viewport);
                this.renderTargets[ridx].bindTexture();
            }
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        this.viewport.bind();
        this.viewport.render();
    }

    onResize(nw, nh) {
        this.renderTargets[0] = new RenderTarget(this.ctx, this.ctx.canvas.width, this.ctx.canvas.height, true, true); //This is our render target
        this.renderTargets[1] = new RenderTarget(this.ctx, this.ctx.canvas.width, this.ctx.canvas.height, false, true);
        this.renderTargets[2] = new RenderTarget(this.ctx, this.ctx.canvas.width, this.ctx.canvas.height, false, true);
        this.viewport = new Viewport(this.ctx, 50, 50, this.ctx.canvas.width - 100, this.ctx.canvas.height - 100);
    }
    render(gameworld) {
        this.renderTargets[0].bind();
        this.clear();
        this.program.activate();
        
        var cameraID = gameworld.scene.mainCameraID;
        this.ctx.uniformMatrix4fv(
            this.program.uniformLocation("u_projectionMatrix"),
            false,
            gameworld.scene.cameras[cameraID].projectionMatrix
        );

        this.ctx.uniformMatrix4fv(
            this.program.uniformLocation("u_viewMatrix"),
            false,
            gameworld.scene.cameras[cameraID].sceneNode.worldMatrix
        );

        // Recursively render each mesh component.
        gameworld.children.forEach((child) => {
          this.recursiveRender(child);
        }); 
        this.pushTexture();
    }
}
