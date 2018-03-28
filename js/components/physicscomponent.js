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
    }

    draw(program, gl) {
        if(!this.model) {
            this.model = new Model(gl, this.indices, this.vertices, this.color);
        }
        this.model.render(program);
        var transform = mat4.create();
        mat4.fromTranslation(transform, this.translation);
        mat4.multiply(
            transform, 
            transform, 
            this.owner.getComponent(
                ComponentID.COMPONENT_TRANSFORM
            ).worldTransform
        ); 
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
        var center = this.owner.transformComponent.getWorldTranslation();
        var otherCenter = other.owner.transformComponent.getWorldTranslation();

        var otherMin = [otherCenter[0] - other.offsetX, otherCenter[1] - other.offsetY, otherCenter[2] - other.offsetZ];
        var otherMax = [otherCenter[0] + other.offsetX, otherCenter[1] + other.offsetX, otherCenter[2] + other.offsetZ];
        var min = [center[0] - this.offsetX, center[1] - this.offsetY, center[2] - this.offsetZ];
        var max = [center[0] + this.offsetX, center[1] + this.offsetY, center[2] + this.offsetZ];

        //console.log("MinZ:" + min[2]);
        //console.log("OthermaxZ: " + otherMax[2]);
        //console.log("MinZ <= otherMaxZ: " + (min[2] <= otherMax[2]));

        return (min[0] <= otherMax[0] && max[0] >= otherMin[0]) &&
               (min[1] <= otherMax[1] && max[1] >= otherMin[1]) &&
               (min[2] <= otherMax[2] && max[2] >= otherMin[2]);
    }
};
class PhysicsComponent extends EntityComponent {
    constructor(owner) {
        super(ComponentID.COMPONENT_PHYSICS, owner);

        this.interpolateMovement = true;
        this.velocity = vec3.fromValues(0, 0, 0);
        this.acceleration = vec3.fromValues(0, 0, 0);
        this.brakingAcceleration = vec3.fromValues(0, 0, 0);
        this.angularVelocity = vec3.fromValues(0, 0, 0);
        this.lastTransform = mat4.create();
        this.maxSpeed = 50;
    }

    isMoving() {
        if(this.owner.owner.eid != 0 && this.owner.owner.hasComponent(ComponentID.COMPONENT_PHYSICS)) {
            return this.owner.owner.getComponent(ComponentID.COMPONENT_PHYSICS).isMoving();
        }
        return this.velocity[Math.X] != 0 || this.velocity[Math.Y] != 0 || this.velocity[Math.Z] != 0;
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
        
        var speed = vec3.length(this.velocity);
        vec3.scaleAndAdd(
            this.velocity,
            this.velocity,
            this.acceleration,
            step
        );
        if(speed > this.maxSpeed) {
            vec3.normalize(this.velocity, this.velocity);
            vec3.scale(this.velocity, this.velocity, this.maxSpeed);   
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
