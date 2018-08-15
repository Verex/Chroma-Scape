var CollisionType = {
    COLLISION_NONE: 0,
    COLLISION_SOLID: 1,
    COLLISION_TRIGGER: 2
};
class PhysicsComponent extends EntityComponent {
    constructor(owner) {
        super(ComponentID.COMPONENT_PHYSICS, owner);

        this.interpolateMovement = true;

        // Define linear and angular velocity.
        this.velocity = vec3.fromValues(0, 0, 0);
        this.angularVelocity = vec3.fromValues(0, 0, 0);

        // Define linear and angular acceleration.
        this.acceleration = vec3.fromValues(0, 0, 0);
        this.angularAcceleration = vec3.fromValues(0, 0, 0);

        // Define max linear and angular velocity for any direction.
        this.maxVelocity = 50;
        this.maxAngularVelocity = 50;

        // Define last transform.
        this.lastTransform = mat4.create();

        // Define collision type.
        this.collisionType = CollisionType.COLLISION_NONE;
    }

    isMoving() {
        if(this.owner.eid == 0) return false;
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

        // Get current linear velocity.
        var velocity = vec3.length(this.velocity);

        // Increase velocity by acceleration.
        vec3.scaleAndAdd(
            this.velocity,
            this.velocity,
            this.acceleration,
            step
        );

        // Cap out linear velocity at max.
        if(velocity > this.maxVelocity) {
            vec3.normalize(this.velocity, this.velocity);
            vec3.scale(this.velocity, this.velocity, this.maxVelocity);
        }

        // Get current angular velocity.
        var angularVelocity = vec3.length(this.angularVelocity);

        // Increase our velocity by acceleration.
        vec3.scaleAndAdd(
            this.angularVelocity,
            this.angularVelocity,
            this.angularAcceleration,
            step
        );

        // Cap angular velocity at max.
        if(angularVelocity > this.maxAngularVelocity) {
            vec3.normalize(this.angularVelocity, this.angularVelocity);
            vec3.scale(this.angularVelocity, this.angularVelocity, this.maxAngularVelocity);
        }

        var tempOrigin = vec3.create();
        var collision = false;
        if(this.aabb && this.isMoving() && this.collisionType == CollisionType.COLLISION_SOLID) {
            vec3.copy(tempOrigin, transformComponent.absOrigin);
            var collidables = this.owner.getGameWorld().queryCollisionTree(this.owner);
            vec3.scaleAndAdd(
                tempOrigin,
                transformComponent.absOrigin,
                this.velocity,
                step
            );
            for(var i = 0; i < collidables.length; i++) {
                var collidable = collidables[i];
                vec3.copy(
                    this.aabb.origin,
                    tempOrigin
                );
                if(this.aabb.checkCollision(collidable.aabb)) {
                    collision = true;
                    break;
                }
            }
            if(!collision) {
                vec3.copy(
                    transformComponent.absOrigin,
                    tempOrigin
                );
            }
        } else {
            vec3.scaleAndAdd(
                transformComponent.absOrigin,
                transformComponent.absOrigin,
                this.velocity,
                step
            );
        }
        if(this.aabb) {
            vec3.copy(this.aabb.origin, transformComponent.getWorldTranslation());
        }

        vec3.scaleAndAdd(
            transformComponent.absRotation,
            transformComponent.absRotation,
            this.angularVelocity,
            step
        );
    }
}
