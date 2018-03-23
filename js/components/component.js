var ComponentID = {
    COMPONENT_TRANSFORM: 0,
    COMPONENT_MESH: 1,
    COMPONENT_INPUT: 2,
    COMPONENT_PHYSICS: 3,
    COMPONENT_MAX: 4 //This is the number of components that we recognize as a thing
}

class EntityComponent {
    constructor(guid, owner) {
        this.guid = guid;
        this.owner = owner;
    }

    static get ComponentFactory() {
        class ComponentFactory {
            constructor(ent) {
                this.ent = ent;
            }
            construct(cid) {
                switch(cid) {
                    case ComponentID.COMPONENT_TRANSFORM:
                        this.ent.components[cid] = new TransformComponent(this.ent);
                        return this;
                    case ComponentID.COMPONENT_MESH:
                        this.ent.components[cid] = new MeshComponent(this.ent);
                        return this;
                    case ComponentID.COMPONENT_INPUT:
                        this.ent.components[cid] = new InputComponent(this.ent);
                        return this;
                    case ComponentID.COMPONENT_PHYSICS:
                        this.ent.components[cid] = new PhysicsComponent(this.ent);
                    default:
                        return this;
                }
            }
        };
        return ComponentFactory;
    }
};
