class GameWorld extends Entity {
    constructor() {
        super(newID++, undefined, EntityType.ENTITY_GAMEWORLD);
        this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);
        this.componentFactory.construct(ComponentID.COMPONENT_INPUT);

        this.inputComponent = this.getComponent(ComponentID.COMPONENT_INPUT);

        //HACK HACK(Jake): I couldn't really think of a place to put this so for now our game world will hold our scene
        //and our renderer will be responsible for processing the gameworld and rendering it's scene
        this.scene = new Scene();
        this.sceneNode = new SceneNode(this);
        this.scene.rootNode = this.sceneNode;

        this.inputComponent.registerEvent(
          InputMethod.INPUT_KEYBOARD,
          InputType.BTN_RELEASE,
          'KeyE',
          (event) => {
            this.scene.mainCameraID = ((this.scene.mainCameraID + 1) % this.scene.cameras.length);
          }
        );

    this.inputComponent.registerEvent(
          InputMethod.INPUT_KEYBOARD,
          InputType.BTN_RELEASE,
          'KeyQ',
          (event) => {
            this.children[0].camera.boomAngle += 30;
          }
        );
    }

    onEntityCreated(newEnt) {
        switch(newEnt.type) {
            case EntityType.ENTITY_CAMERA: //We need to add our camera to our scene
                this.scene.cameras.push(newEnt);
                break;
            default: break;
        }
        newEnt.sceneNode = new SceneNode(newEnt);
        if(newEnt.owner) {
            newEnt.sceneNode.attachTo(newEnt.owner.sceneNode);
        }
    }

    tick(dt) {
        super.tick(dt);
    }

    queryCollision() {
        var collidables = [];
        var moving = [];
        var time = Date.now();
        var queryCollisionRecursive = (ent) => {
            if(ent.hasComponent(ComponentID.COMPONENT_PHYSICS)) {
                var physicsComponent = ent.getComponent(ComponentID.COMPONENT_PHYSICS);
                if(physicsComponent.aabb) {
                    collidables.push(physicsComponent);
                    if(physicsComponent.isMoving()) {
                        moving.push(physicsComponent);
                    } 
                }
            }
            ent.children.forEach((value, index, array) => {
                queryCollisionRecursive(value);
            });
        };
        queryCollisionRecursive(this);
        moving.forEach((value, index, array) => {
            collidables.forEach((nValue, nIndex, nArray) => {
                if(nValue.owner.eid != value.owner.eid) {
                    if(value.aabb.checkCollision(
                        nValue.aabb
                    ) && GlobalVars.getInstance().tickcount > 1) {
                        value.owner.onCollisionOverlap(nValue);
                        nValue.owner.onCollisionOverlap(value);
                        //console.log("COLLISION!");
                    }
                }
            });
        });

        //time = Date.now() - time;
        //console.log("Collision took: " + time);
    }

    updateSceneGraph() {
        this.sceneNode.update();
    }

    getViewMatrix() {
        return this.scene.cameras[this.scene.mainCameraID].getComponent(ComponentID.COMPONENT_TRANSFORM).worldTransform;
    }
};
EntityType.ENTITY_GAMEWORLD.construction = () => {
    if(newID != 0) {
        console.error("Game world not root!");
        return null;
    }
    return new GameWorld();
}
