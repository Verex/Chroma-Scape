    var EntityType = {
    ENTITY_INVALID: {id:-1, construction: (owner) => {console.error("no");}},
    ENTITY_GAMEWORLD: {id: 0},
    ENTITY_CAMERA: {id: 1}
}

var newID = 0;
class Entity {
    constructor(eid, owner, type = EntityType.ENTITY_INVALID) {
        this.type = type;
        this.eid = eid;
        this.owner = owner;
        if(owner && owner.type.id != EntityType.ENTITY_INVALID.id) {
            owner.children.push(this);
        }
        this.children = [];
        this.components = [];
        for(let i = 0; i < ComponentID.COMPONENT_MAX; i++) {
            this.components[i] = null;
        }

        this.componentFactory = new EntityComponent.ComponentFactory(this);
    }

    onEntityCreated(newEnt) {
        if(this.owner) {
            this.owner.onEntityCreated(newEnt);
        }
    }

    hasComponent(cid) {
        return this.components[cid] != undefined;
    }

    static get Factory() {
        class Factory {
            constructor(parent) {
                this.parent = parent;
            }
            ofType(type) {
                if(type.id != -1 && type.construction) {
                    var newEnt = type.construction(this.parent);
                    newEnt.onEntityCreated(newEnt);
                    return newEnt;
                }
            }
        }
        return Factory;
    }
};