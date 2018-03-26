class AABB  {
    constructor(owner, width, height, depth) {
        this.owner = owner;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.offsetX = (this.width / 2);
        this.offsetY = (this.height / 2);
        this.offsetZ = (this.depth / 2);
        this.mesh = TestMesh();
        this.vertices = this.mesh.vertices();
        this.color = this.mesh.color();
        this.indices = this.mesh.indices();
        this.vtxBuffer = null; //gl.createBuffer();
        this.clrBuffer = null;
        this.idxBuffer = null;

        this.numVertices = this.vertices.length / 3;
    }

    draw(program, gl) {
        if(!this.mesh) return;
        if(this.vtxBuffer == null || this.clrBuffer == null || this.idxBuffer == null) {
            this.vtxBuffer = gl.createBuffer();
            this.clrBuffer = gl.createBuffer();
            this.idxBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vtxBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.clrBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.color), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.idxBuffer);
            console.log(this.indices);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
        }
        {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vtxBuffer);
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
            gl.bindBuffer(gl.ARRAY_BUFFER, this.clrBuffer);
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
        gl.uniformMatrix4fv(
            program.uniformLocation("u_modelMatrix"),
            false,
            this.owner.components[ComponentID.COMPONENT_TRANSFORM].worldTransform
        );
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.idxBuffer);
        {
            const vertexCount = this.indices.length;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.LINE_STRIP, vertexCount, type, offset);
        }
    }
};
class PhysicsComponent extends EntityComponent {
    constructor(owner) {
        super(ComponentID.COMPONENT_PHYSICS, owner);

        this.interpolateMovement = true;
        this.velocity = vec3.fromValues(0, 0, 0);
        this.angularVelocity = vec3.fromValues(0, 0, 0);
        this.lastTransform = mat4.create();
    }

    physicsSimulate(step) {
        if(!this.owner.hasComponent(ComponentID.COMPONENT_TRANSFORM)) {
            return;
        }
        var transformComponent = this.owner.getComponent(ComponentID.COMPONENT_TRANSFORM);
        if(this.interpolateMovement) {
            mat4.copy(
                this.lastTransform,
                transformComponent.localTransform
            );
        }
        vec3.scaleAndAdd(
            transformComponent.absOrigin,
            transformComponent.absOrigin,
            this.velocity,
            step
        );

        vec3.scaleAndAdd(
            transformComponent.absRotation,
            transformComponent.absRotation,
            this.angularVelocity,
            step
        );
    }
}
