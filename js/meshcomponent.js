class MeshComponent extends EntityComponent {
    constructor(owner) {
        super(ComponentID.COMPONENT_MESH, owner);
    }

    static get CID() { return ComponentID.COMPONENT_MESH; };
};