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
