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
    ENTITY_MENUCONTROLLER: {id: 11},
    ENTITY_WALL: {id: 12},
    ENTITY_HUDCONTROLLER: {id: 13},
    ENTITY_GAMESTATE: {id: 14}
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
    }

    awake() {
        for(var i = 0; i < this.children.length; i++) {
            this.children[i].awake();
        }
    }

    tick(dt) {
        for(var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            child.tick(dt);
        }
    }

    destroy() {
        var cidx = this.owner.children.indexOf(this);
        if(cidx >= 0) {
            this.owner.children.splice(cidx, 1);
        }
    }

    findChild(name) {
        for(var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            if(child.name == name) {
                return child;
            } else {
                var c = child.findChild(name);
                if(c) {
                    return c;
                }
            }
        }
        return undefined;
    }

    findEntity(name) {
        var root = this;
        if(root.owner) {
            do {
                root = root.owner;
            } while(root.owner);
        }
        return root.findChild(name);
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

    getChildren(entityType) {
      var children = [];

      for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].type == entityType) {
          children.push(this.children[i]);
        }
      }

      return children;
    }

    static get Factory() {
        class Factory {
            constructor(parent) {
                this.parent = parent;
            }
            ofType(type, notify = false) {
                if(type.id != -1 && type.construction) {
                    var newEnt = type.construction(this.parent);
                    if(notify) {
                        var activeScene = SceneManager.getInstance().activeScene;
                        if(activeScene) {
                            activeScene.onEntityCreated(newEnt);
                        }
                    }
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
