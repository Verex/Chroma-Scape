class TransformComponent extends EntityComponent {
    constructor(owner) {
        super(ComponentID.COMPONENT_TRANSFORM, owner);

        this.transform = mat4.create();
    }

    static get CID() { return ComponentID.COMPONENT_TRANSFORM; };
};