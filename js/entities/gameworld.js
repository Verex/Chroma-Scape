class GameWorld extends Entity {
    constructor() {
      super(newID++, undefined, EntityType.ENTITY_GAMEWORLD);
      this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);
      this.componentFactory.construct(ComponentID.COMPONENT_INPUT);
      this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);

      this.inputComponent = this.getComponent(ComponentID.COMPONENT_INPUT);
      this.meshComponent = this.getComponent(ComponentID.COMPONENT_MESH);

      //HACK HACK(Jake): I couldn't really think of a place to put this so for now our game world will hold our scene
      //and our renderer will be responsible for processing the gameworld and rendering it's scene
      this.scene = new Scene();
      this.sceneNode = new SceneNode(this);
      this.scene.rootNode = this.sceneNode;

      // Assign max z-value before we reset position.
      this.zReset = -2000;
      this.gamestate = new Gamestate();

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
            this.spawner.spawnPortal(vec3.fromValues(0, 25, this.player.transformComponent.absOrigin[Math.Z] - 200));
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
      this.handleZReset();
      super.tick(dt);
    }

    queryCollisionTree(ent, type = CollisionType.COLLISION_SOLID) {
        var collidables = [];
        var queryCollisionRecursive = (itr) =>{
            if(itr.eid != 0 && itr.eid != ent.eid) {
                if(itr.hasComponent(ComponentID.COMPONENT_PHYSICS)) {
                    var d = Math.distance(
                        ent.transformComponent.getWorldTranslation(),
                        itr.transformComponent.getWorldTranslation()
                    );
                    if(d < 2000) {
                        var physicsComponent = itr.getComponent(ComponentID.COMPONENT_PHYSICS);
                        if(physicsComponent.collisionType == type) {
                            if(physicsComponent.aabb) {
                                collidables.push(physicsComponent);
                            }
                            if(physicsComponent.isMoving()) {
                                collidables.push(physicsComponent);
                            }
                        }
                    }
                }
            }
            itr.children.forEach((value, index, array) => {
                queryCollisionRecursive(value);
            });
        }
        queryCollisionRecursive(this);
        return collidables;
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

    handleZReset() {
      // Get player's current position.
      var position = this.player.transformComponent.absOrigin;

      // Check if the player has gone past our z-Reset.
      if (position[Math.Z] <= this.zReset) {
        // Subtract our zReset from origin.
        this.player.transformComponent.absOrigin[Math.Z] -= this.zReset;

        // Move all portals back as well.
        this.children.forEach((child) => {
          switch(child.type) {
            case EntityType.ENTITY_PORTAL:
              child.transformComponent.absOrigin[Math.Z] -= this.zReset;
              break;
            case EntityType.ENTITY_SPAWNER:
              child.lastPortal[Math.Z] = child.lastPortal[Math.Z] % this.zReset;
              break;
          }
        });
      }
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
