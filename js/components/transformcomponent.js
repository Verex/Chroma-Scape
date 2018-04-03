class TransformComponent extends EntityComponent {
    constructor(owner) {
        super(ComponentID.COMPONENT_TRANSFORM, owner);

        this.worldTransform = mat4.create();
        this.localTransform = mat4.create();
        this.absOrigin = vec3.fromValues(0,0,0);
        this.absRotation = vec3.fromValues(0,0,0);
        this.absScale = vec3.fromValues(1,1,1);
        this.upVector = vec3.fromValues(0, 1, 0);
    }

    updateTransform() {
        var q = this.getRotationQuaternion();
        mat4.fromRotationTranslationScale(
            this.localTransform,
            q,
            this.absOrigin,
            this.absScale
        );
    }

    getRotationQuaternion() {
        var q = quat.create();
        quat.fromEuler(
            q,
            this.absRotation[Math.PITCH],
            this.absRotation[Math.YAW],
            this.absRotation[Math.ROLL]
        );

        return q;
    }
    translateToLocal(pos) {
        var res = vec3.create();
        vec3.transformMat4(
            res, 
            pos,
            this.getInvWorldTransform()
        );
        return res;
    }
    translateToWorld(pos) {
        var res = vec3.create();
        var originMat = mat4.create();
        mat4.fromTranslation(originMat, this.getWorldTranslation());
        vec3.transformMat4(res, pos, originMat);
        return res;
    }
    getWorldTranslation() {
        var res = vec3.create();
        mat4.getTranslation(res, this.worldTransform);
        return res;
    }

    getWorldRotation() {
        var res = vec3.create();
        mat4.getRotation(res, this.worldTransform);
        return res;
    }

    getInvWorldTransform() {
        var res = mat4.create();
        mat4.invert(res, this.worldTransform);
        return res;
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