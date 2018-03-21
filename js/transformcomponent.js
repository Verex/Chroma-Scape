class TransformComponent extends EntityComponent {
    constructor(owner) {
        super(ComponentID.COMPONENT_TRANSFORM, owner);

        this.worldTransform = mat4.create();
        this.localTransform = mat4.create();
        this.origin = vec3.fromValues(0,0,0);
        this.rotation = vec3.fromValues(0,0,0);
        this.scale = vec3.fromValues(1,1,1);
    }

    updateTransform() {
        var q = quat.create();
        quat.fromEuler(
            q,
            this.rotation[Math.PITCH],
            this.rotation[Math.YAW],
            this.rotation[Math.ROLL]
        );

        mat4.fromRotationTranslationScale(
            this.localTransform,
            q,
            this.origin,
            this.scale
        );
    }

    computeWorldTransform(worldMatrix) {
        if(worldMatrix !== undefined) {
            mat4.multiply(this.worldTransform, worldMatrix, this.localTransform);
        } else {
            mat4.copy(this.worldTransform, this.localTransform);
        }

        return this.worldTransform;
    }

    static get CID() { return ComponentID.COMPONENT_TRANSFORM; };
};