class MeshComponent extends EntityComponent {
    constructor(owner) {
        super(ComponentID.COMPONENT_MESH, owner);
    }

    setModel(model) {
        this.model = model;
    }
    preRender(program, gl) {
        if(!this.model) return;
        {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.model.vtxBuffer);
            gl.vertexAttribPointer(
                program.attributeLocation("a_position"),
                numComponents,
                type,
                normalize,
                stride,
                offset
            );
            gl.enableVertexAttribArray(
                program.attributeLocation("a_position")
            );
        }
        {
            const numComponents = 4;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.model.clrBuffer);
            gl.vertexAttribPointer(
                program.attributeLocation("a_color"),
                numComponents,
                type,
                normalize,
                stride,
                offset
            );
            gl.enableVertexAttribArray(
                program.attributeLocation("a_color")
            );
        }
    }
    /*
    uniform mat4 u_viewMatrix;
    uniform mat4 u_modelMatrix;
    uniform mat4 u_projectionMatrix;
    */
    render(program, gl) {
        this.preRender(program, gl);
        gl.uniformMatrix4fv(
            program.uniformLocation("u_modelMatrix"),
            false,
            this.owner.components[ComponentID.COMPONENT_TRANSFORM].worldTransform
        );

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.model.idxBuffer);
        {
            const vertexCount = this.model.indices.length;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }


    }

    static get CID() { return ComponentID.COMPONENT_MESH; };
};
