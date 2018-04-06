var EntityType = {
    ENTITY_INVALID: {id:-1, construction: (owner) => {console.error("no");}},
    ENTITY_GAMEWORLD: {id: 0},
    ENTITY_GENERIC: {id: 1},
    ENTITY_CAMERA: {id: 2},
    ENTITY_PLAYER: {id: 3},
    ENTITY_SHIP: {id: 4},
    ENTITY_DUMMY: {id: 5},
    ENTITY_CAMERABOOM: {id: 6},
    ENTITY_PORTAL: {id: 7},
    ENTITY_SPAWNER: {id: 8},
    ENTITY_SPEAKER: {id: 9},
    ENTITY_PILLAR: {id: 10},
};

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
        this.onSolidCollision = undefined;
    }

    tick(dt) {
        this.children.forEach((value, index, array) => {
            value.tick(dt);
        });
    }

    onEntityCreated(newEnt) {
        if(this.owner) {
            this.owner.onEntityCreated(newEnt);
        }
    }

    getGameWorld() {
        if(this.owner !== undefined) {
            return this.owner.getGameWorld();
        }
        return this;
    }

    hasComponent(cid) {
        return this.components[cid] != undefined;
    }

    getComponent(cid) {
        if(cid >= 0 && cid < ComponentID.COMPONENT_MAX) {
            var c = this.components[cid];
            if(!c) {
                this.componentFactory.construct(cid);
                c = this.components[cid];
            }
            return c;
        } else {
            Console.error("INVALID COMPONENT ID: " + cid);
            return undefined;
        }
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

EntityType.ENTITY_GENERIC.construction = (owner) => {
    return new Entity(newID++, owner, EntityType.ENTITY_GENERIC);
}
