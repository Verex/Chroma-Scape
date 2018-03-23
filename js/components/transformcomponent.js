class TransformComponent extends EntityComponent {
    constructor(owner) {
        super(ComponentID.COMPONENT_TRANSFORM, owner);

        this.worldTransform = mat4.create();
        this.localTransform = mat4.create();
        this.absOrigin = vec3.fromValues(0,0,0);
        this.absRotation = vec3.fromValues(0,0,0);
        this.absScale = vec3.fromValues(1,1,1);
    }

    updateTransform() {
        var q = quat.create();
        quat.fromEuler(
            q,
            this.absRotation[Math.PITCH],
            this.absRotation[Math.YAW],
            this.absRotation[Math.ROLL]
        );

        mat4.fromRotationTranslationScale(
            this.localTransform,
            q,
            this.absOrigin,
            this.absScale
        );
    }

    computeWorldTransform(worldMatrix) {
        if(worldMatrix !== undefined) {
            mat4.multiply(this.worldTransform, worldMatrix, this.localTransform);

            // HACK HACK: Invert the world transform if we're a camera? I feel like cam should handle this.
            if (this.owner.type == EntityType.ENTITY_CAMERA) {
              mat4.invert(this.worldTransform, this.worldTransform);
            }
        } else {
            mat4.copy(this.worldTransform, this.localTransform);
        }

        return this.worldTransform;
    }

    static get CID() { return ComponentID.COMPONENT_TRANSFORM; };
};
