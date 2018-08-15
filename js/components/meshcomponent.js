class MeshComponent extends EntityComponent {
    constructor(owner) {
        super(ComponentID.COMPONENT_MESH, owner);
        this.shouldRender = true;
    }
    setMaterial(material) {
        this.material = material;
    }
    setModel(model) {
        this.model = model;
    }

    render(gl, camera) {
        if (!this.shouldRender) return;
        if(!this.model) return;
        if (this.material == undefined) {
            this.material = Assets.getInstance().getMaterial("Standard"); //If we don't have an assigned material, assume Standard.
        }
        Object.keys(this.material.passes).forEach((value) => {
            var pass = this.material.passes[value];
            var program = this.material.renderPrograms[pass.shader];
            program.activate();
            gl.uniformMatrix4fv(
                program.uniformLocation("u_projectionMatrix"),
                false,
                camera.projectionMatrix
            );
            gl.uniformMatrix4fv(
                program.uniformLocation("u_viewMatrix"),
                false,
                camera.sceneNode.worldMatrix
            );
            this.model.render(program);
            gl.uniformMatrix4fv(
                program.uniformLocation("u_modelMatrix"),
                false,
                this.owner.components[ComponentID.COMPONENT_TRANSFORM].worldTransform
            );
            if(this.owner.setupMaterial !== undefined) {
                this.owner.setupMaterial.apply(this.owner, [gl]);
            }
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
        })
    }

    static get CID() { return ComponentID.COMPONENT_MESH; };
};
