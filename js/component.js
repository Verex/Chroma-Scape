var ComponentID = {
    COMPONENT_TRANSFORM: 0,
    COMPONENT_MESH: 1,
    COMPONENT_MAX: 2 //This is the number of components that we recognize as a thing
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
                    default: 
                        return this;
                }
            }
        };
        return ComponentFactory;
    }
};