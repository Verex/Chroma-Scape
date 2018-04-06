class MeshComponent extends EntityComponent {
    constructor(owner) {
        super(ComponentID.COMPONENT_MESH, owner);
    }

    setModel(model) {
        this.model = model;
    }
    preRender(program, gl) {
        if(!this.model) return;

    }
    /*
    uniform mat4 u_viewMatrix;
    uniform mat4 u_modelMatrix;
    uniform mat4 u_projectionMatrix;
    */
    render(program, gl) {
        if(!this.model) return;
        if(this.owner.type == EntityType.ENTITY_SHIP) {
            var color = this.owner.owner.color.serialize(); // Get our player

            // Color the player's body for color selection.
            gl.uniform4f(
                program.uniformLocation("u_selectionColor"),
                color[0],
                color[1],
                color[2],
                color[3]
            );

            // HACK HACK: Thruster color based on time? Must be better way to do this.
            var time = Timer.getInstance();
            var cTime = time.getCurrentTime(),
                f = (cTime % 5000) / 5000;

            var add = 0.2;
            if (f <= 0.5) {
              add *= (f/0.5);
            } else {
              add -= add * (f - 0.5/0.5);
            }

            gl.uniform4f(
                program.uniformLocation("u_thrusterColor"),
                0.086 + add,
                0.596 + add,
                0.886 + add,
                1.0
            );
        } else if(this.owner.type == EntityType.ENTITY_PORTAL) {
            var color = this.owner.color.serialize();

            // Color our portal.
            gl.uniform4f(
                program.uniformLocation("u_selectionColor"),
                color[0],
                color[1],
                color[2],
                color[3]
            );
        }
        this.model.render(program);
        gl.uniformMatrix4fv(
            program.uniformLocation("u_modelMatrix"),
            false,
            this.owner.components[ComponentID.COMPONENT_TRANSFORM].worldTransform
        );
        if(this.model.idxBuffer) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.model.idxBuffer);
            {
                const vertexCount = this.model.indices.length;
                const type = gl.UNSIGNED_SHORT;
                const offset = 0;
                gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
            }
        } else {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.model.vtxBuffer);
            {
                const vertexCount = this.model.numVertices;
                gl.drawArrays(
                    gl.LINES,
                    0,
                    vertexCount
                );
            }
        }
    }

    static get CID() { return ComponentID.COMPONENT_MESH; };
};
