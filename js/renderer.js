/*
    Renderer class
    A renderer object will be responsible for rendering a scene
    A renderer object should be able to be extended for more specific use
*/

class Renderer {
    constructor(glContext, textCtx) {
        this.ctx = glContext;
        this.textCtx = textCtx;
        this.program = new Program.Builder(glContext).
               withShader("assets/shaders/vertex.glsl", glContext.VERTEX_SHADER, "VERTEX").
               withShader("assets/shaders/fragment.glsl", glContext.FRAGMENT_SHADER, "FRAGMENT").
               build();

        this.renderTargets = [];
        this.renderTargets[0] = new RenderTarget(glContext, glContext.canvas.width, glContext.canvas.height, true, true); //This is our render target
        this.renderTargets[1] = new RenderTarget(glContext, glContext.canvas.width, glContext.canvas.height, false, true);
        this.renderTargets[2] = new RenderTarget(glContext, glContext.canvas.width, glContext.canvas.height, false, true);

        this.textRenderTarget = new RenderTarget(glContext, glContext.canvas.width, glContext.canvas.height, false, true);
        this.viewport = new Viewport(glContext, 50, 50, glContext.canvas.width - 100, glContext.canvas.height - 100);

        this.textCanvasTexture = glContext.createTexture();


        this.renderPasses = [
            new CopyPass(glContext),
            new CurvedPass(glContext),
            //new ScalePass(glContext),
            //new BarrelPass(glContext),
            new CRTPass(glContext),
            new ScanlinePass(glContext)
        ];

        this.uiPass = new UIPass(glContext);
    }
    clear(color = BLACK) {
        //this.ctx.colorMask(false, false, false, true);
        this.ctx.clearColor(0, 0, 0, 1);
        this.ctx.enable(this.ctx.DEPTH_TEST);
        this.ctx.clear(this.ctx.COLOR_BUFFER_BIT | this.ctx.DEPTH_BUFFER_BIT);
    }

    recursiveRender(ent) {
      // Render entity's mesh if it exists.
      if (ent.hasComponent(ComponentID.COMPONENT_MESH)) {
        ent.components[ComponentID.COMPONENT_MESH].render(this.program, this.ctx);
      }

      if(ent.hasComponent(ComponentID.COMPONENT_TEXT)) {
          ent.components[ComponentID.COMPONENT_TEXT].render(this.textCtx);
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

    postProcessing() {
        var gl = this.ctx;
        var viewport = this.viewport;
        var renderTargets = this.renderTargets;
        viewport.bind();

        //Bind our static geometry render target
        this.renderTargets[0].bindTexture();
        this.renderTargets[1].bind();
        this.renderPasses[0].doPass(this.viewport); //Copy our geometry onto our viewport quad as a texture
        //this.renderTargets[1].bindTexture();

        if(postProcessing) {
            //Apply our render passes
            for(var i = 1; i < this.renderPasses.length; i++) {
                var ridx = (i % (this.renderTargets.length )); //Flip flop between render targets
                var pass = this.renderPasses[i];
                this.renderTargets[ridx].bind();
                this.renderPasses[i].doPass(this.viewport);
                this.renderTargets[ridx].bindTexture();
            }
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        this.viewport.bind();
        this.viewport.render();
    }

    blitCanvasTexture(textureCanvas) {
        var gl = this.ctx;
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.bindTexture(gl.TEXTURE_2D, this.textCanvasTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureCanvas); // This is the important line!
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D); 

        this.textRenderTarget.bind();
        this.uiPass.sceneTexture = this.renderTargets[0].texture;
        this.uiPass.doPass(this.viewport);
        this.textRenderTarget.bindTexture();
        

    }

    onResize(nw, nh) {
        this.renderTargets[0] = new RenderTarget(this.ctx, this.ctx.canvas.width, this.ctx.canvas.height, true, true); //This is our render target
        this.renderTargets[1] = new RenderTarget(this.ctx, this.ctx.canvas.width, this.ctx.canvas.height, false, true);
        this.renderTargets[2] = new RenderTarget(this.ctx, this.ctx.canvas.width, this.ctx.canvas.height, false, true);
        this.viewport = new Viewport(this.ctx, 50, 50, this.ctx.canvas.width - 100, this.ctx.canvas.height - 100);
    }
    render(gameworld) {
        this.renderTargets[0].bind();
        this.clear(DARK);
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
        this.recursiveRender(gameworld);
    }
}
