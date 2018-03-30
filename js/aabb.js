class AABB  {
    constructor(owner, width, height, depth) {
        this.owner = owner;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.offsetX = (this.width / 2);
        this.offsetY = (this.height / 2);
        this.offsetZ = (this.depth / 2);
        this.mesh = AABBMesh(this.offsetX, this.offsetY, this.offsetZ);
        this.vertices = this.mesh.vertices();
        this.color = this.mesh.color();
        this.indices = this.mesh.indices();
        this.translation = vec3.fromValues(0, 0, 0);
        this.origin = vec3.fromValues(0, 0, 0);
    }

    draw(program, gl) {
        if(!this.model) {
            this.model = new Model(gl, this.indices, this.vertices, this.color);
        }
        gl.uniform1i(
            program.uniformLocation("u_ignoreLighting"),
            1
        );
        this.model.render(program);
        var transform = mat4.create();
        var finalPosition = vec3.create();
        vec3.add(
            finalPosition,
            this.origin,
            this.translation
        );
        mat4.fromTranslation(transform, finalPosition);
        if(this.owner.type == EntityType.ENTITY_PLAYER) {
            //console.log(this.origin, this.owner.transformComponent);
        }
        gl.uniformMatrix4fv(
            program.uniformLocation("u_modelMatrix"),
            false,
            transform
        );
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.model.idxBuffer);
        {
            const vertexCount = this.indices.length;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.LINE_STRIP, vertexCount, type, offset);
        }
    }
    checkCollision(other) {
        var center = this.origin;
        var otherCenter = other.origin;

        if(this.owner.owner && this.owner.owner.hasComponent(ComponentID.COMPONENT_TRANSFORM)) {
            vec3.add(
                center,
                center,
                this.owner.owner.getComponent(ComponentID.COMPONENT_TRANSFORM).getWorldTranslation()
            );
            this.origin = center;
        }

        var otherMin = [otherCenter[0] - other.offsetX, otherCenter[1] - other.offsetY, otherCenter[2] - other.offsetZ];
        var otherMax = [otherCenter[0] + other.offsetX, otherCenter[1] + other.offsetX, otherCenter[2] + other.offsetZ];
        var min = [center[0] - this.offsetX, center[1] - this.offsetY, center[2] - this.offsetZ];
        var max = [center[0] + this.offsetX, center[1] + this.offsetY, center[2] + this.offsetZ];

        return (min[0] <= otherMax[0] && max[0] >= otherMin[0]) &&
               (min[1] <= otherMax[1] && max[1] >= otherMin[1]) &&
               (min[2] <= otherMax[2] && max[2] >= otherMin[2]);
    }
};
