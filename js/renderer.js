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

        this.offScreenSize = [512, 512];

        //HACK HACK(Jake): This is UGLY as FUCK but it works for now, move into RenderTarget class

        this.frameBuffer = glContext.createFramebuffer();
        this.texture = glContext.createTexture();
        this.depthBuffer = glContext.createRenderbuffer();

        glContext.bindTexture(glContext.TEXTURE_2D, this.texture);
        glContext.texImage2D(glContext.TEXTURE_2D, 0, glContext.RGBA, this.offScreenSize[0], this.offScreenSize[1], 0, glContext.RGBA, glContext.UNSIGNED_BYTE, null);
        glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_S, glContext.CLAMP_TO_EDGE);
        glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_T, glContext.CLAMP_TO_EDGE);
        glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.LINEAR);

        glContext.bindRenderbuffer(glContext.RENDERBUFFER, this.depthBuffer);
        glContext.renderbufferStorage(glContext.RENDERBUFFER, glContext.DEPTH_COMPONENT16, this.offScreenSize[0], this.offScreenSize[1]);

        glContext.bindFramebuffer(glContext.FRAMEBUFFER, this.frameBuffer);
        glContext.framebufferTexture2D(glContext.FRAMEBUFFER, glContext.COLOR_ATTACHMENT0, glContext.TEXTURE_2D, this.texture, 0);
        glContext.framebufferRenderbuffer(glContext.FRAMEBUFFER, glContext.DEPTH_ATTACHMENT, glContext.RENDERBUFFER, this.depthBuffer);

        glContext.bindFramebuffer(glContext.FRAMEBUFFER, null);
        glContext.bindTexture(glContext.TEXTURE_2D, null);
        glContext.bindRenderbuffer(glContext.RENDERBUFFER, null);

        this.renderTargetPosBuffer = glContext.createBuffer();
        this.renderTargetTexCoordBuffer = glContext.createBuffer();

        glContext.bindBuffer(glContext.ARRAY_BUFFER, this.renderTargetPosBuffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array([
           -1.0, 1.0,
           1.0, 1.0,
           1.0, -1.0,
           -1.0, 1.0,
           -1.0, -1.0,
           1.0, -1.0,
        ]), glContext.STATIC_DRAW);

        glContext.bindBuffer(glContext.ARRAY_BUFFER, this.renderTargetTexCoordBuffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array([
            0.0,  1.0,
            1.0,  1.0,
            1.0,  0.0,

            0.0,  1.0,
            0.0,  0.0,
            1.0,  0.0
        ]), glContext.STATIC_DRAW);

        //glContext.bindBuffer(glContext.ARRAY_BUFFER, this.renderTargetTexCoordBuffer);
        
        
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
        this.ctx.bindFramebuffer(this.ctx.FRAMEBUFFER, null);
        this.ctx.bindTexture(this.ctx.TEXTURE_2D, this.texture);
        this.ctx.viewport(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.clear();
        this.post.activate();

        var positionLocation = this.post.attributeLocation("a_position");
        var texcoordLocation = this.post.attributeLocation("a_texCoord");
        var offsetLocation = this.post.uniformLocation("u_offset");

        var offset =  GlobalVars.getInstance().curtime / 1000.0 * 2*3.14159 * 0.25; 
        this.ctx.uniform1f(offsetLocation, offset);

        this.ctx.enableVertexAttribArray(positionLocation);

        // Bind the position buffer.
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.renderTargetPosBuffer);
      
        // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var size = 2;          // 2 components per iteration
        var type = this.ctx.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        this.ctx.vertexAttribPointer(
            positionLocation, size, type, normalize, stride, offset);
        this.ctx.enableVertexAttribArray(texcoordLocation);
        // Bind the position buffer.
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.renderTargetTexCoordBuffer);  
        // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var size = 2;          // 2 components per iteration
        var type = this.ctx.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        this.ctx.vertexAttribPointer(
            texcoordLocation, size, type, normalize, stride, offset);
        var primitiveType = this.ctx.TRIANGLES;
        var offset = 0;
        var count = 6;
        this.ctx.drawArrays(primitiveType, offset, count);
        this.ctx.bindTexture(this.ctx.TEXTURE_2D, null);

    }
    render(gameworld) {
        this.ctx.bindFramebuffer(this.ctx.FRAMEBUFFER, this.frameBuffer);
        this.ctx.viewport(0, 0, this.offScreenSize[0], this.offScreenSize[1]);
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
