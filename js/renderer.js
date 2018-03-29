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
        this.post = new Program.Builder(glContext).
               withShader("assets/shaders/post-vertex.glsl", glContext.VERTEX_SHADER, "POST-VERTEX").
               withShader("assets/shaders/post-fragment.glsl", glContext.FRAGMENT_SHADER, "POST-FRAGMENT").
               build();

        this.frameBuffer = glContext.createFramebuffer();
        this.texture = glContext.createTexture();
        this.depthBuffer = glContext.createRenderbuffer();

        glContext.bindTexture(glContext.TEXTURE_2D, this.texture);
        glContext.texImage2D(glContext.TEXTURE_2D, 0, glContext.RGBA, 256, 256, 0, glContext.RGBA, glContext.UNSIGNED_BYTE, null);
        glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.LINEAR);

        glContext.bindRenderbuffer(glContext.RENDERBUFFER, this.depthBuffer);
        glContext.renderbufferStorage(glContext.RENDERBUFFER, glContext.DEPTH_COMPONENT16, 256, 256);

        glContext.bindFramebuffer(glContext.FRAMEBUFFER, this.frameBuffer);
        glContext.framebufferTexture2D(glContext.FRAMEBUFFER, glContext.COLOR_ATTACHMENT0, glContext.TEXTURE_2D, this.texture, 0);
        glContext.framebufferRenderbuffer(glContext.FRAMEBUFFER, glContext.DEPTH_ATTACHMENT, glContext.RENDERBUFFER, this.depthBuffer);

        glContext.bindFramebuffer(glContext.FRAMEBUFFER, null);
        glContext.bindTexture(glContext.TEXTURE_2D, null);
        glContext.bindRenderbuffer(glContext.RENDERBUFFER, null);

        console.log(this.depthBuffer);
        
        
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

    render(gameworld) {
        this.ctx.bindFramebuffer(this.ctx.FRAMEBUFFER, this.frameBuffer);
        this.ctx.viewport(0, 0, 256, 256);
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

        var pixels = new Uint8Array((256 * 256) * 4);
        this.ctx.readPixels(0, 0, 256, 256, this.ctx.RGBA, this.ctx.UNSIGNED_BYTE, pixels);
        console.log(pixels);
    }
}
