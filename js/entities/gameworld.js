var gameControls = {
    keyLeft: 'KeyA',
    keyRight: 'KeyD',
    keyUp: 'KeyW',
    keyDown: 'KeyS',
    color0: 'KeyJ',
    color1: 'KeyL',

    gpColor0: 6,
    gpColor1: 7,
  };
class GameWorld extends Entity {
    constructor() {
      super(newID++, undefined, EntityType.ENTITY_GAMEWORLD);
      this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);
      // Assign max z-value before we reset position.
      this.zReset = -2000;
    }

    cleanupEntities() {
      var found = false;

      // Remove entities.
      do {
        found = false;
        for (var i = 0; i < this.children.length; i++) {
          switch(this.children[i].type) {
            case EntityType.ENTITY_SPAWNER:
            case EntityType.ENTITY_PORTAL:
            case EntityType.ENTITY_WALL:
            case EntityType.ENTITY_PILLAR:
            this.children.splice(i, 1);
            found = true;
            break;
          }
        }
      } while (found);

      //  Create spawner object.
      this.spawner = new Entity.Factory(this).ofType(EntityType.ENTITY_SPAWNER);

      this.player.transformComponent.absOrigin = vec3.fromValues(0, 10, 0);
      this.player.physicsComponent.velocity[Math.Z] = -80;
      this.player.ship.transformComponent.absOrigin = vec3.fromValues(0.0, 0.0, 0.0);
      this.player.hasCrashed = false;
      this.player.ship.transformComponent.updateTransform();
      this.player.transformComponent.updateTransform();

      this.player.menuCamera.transformComponent.absOrigin = vec3.fromValues(0, 10, -50);
      this.player.menuCamera.transformComponent.absRotation = vec3.fromValues(-10, 180, 0);
      this.player.menuCamera.yawBoom = 180;

      this.scene.mainCameraID = 1;
    }

    awake() {
        this.player = this.findChild("Player");
        this.floor = new Entity.Factory(this).ofType(EntityType.ENTITY_DUMMY, true);
        this.floor.transformComponent.absOrigin = vec3.fromValues(0, -5, 0);
        this.floor.meshComponent.setModel(
            Assets.getInstance().getModel("floor")
        );

        this.grid = new Entity.Factory(this).ofType(EntityType.ENTITY_DUMMY, true);
        this.grid.transformComponent.absOrigin = vec3.fromValues(0, 0, 0);
        this.grid.meshComponent.setModel(
            Assets.getInstance().getModel("grid")
        );

        super.awake(); //You have to call this
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
        this.player.transformComponent.updateTransform();
        var worldTranslation = this.player.transformComponent.getWorldTranslation();
        Howler.pos(worldTranslation[Math.X], worldTranslation[Math.Y], worldTranslation[Math.Z]);

        // Move all portals back as well.
        this.children.forEach((child) => {
          switch(child.type) {
            case EntityType.ENTITY_WALL:
            case EntityType.ENTITY_PILLAR:
            case EntityType.ENTITY_PORTAL:
              if(child.children !== undefined) {
                  for(var i = 0; i < child.children.length; i++) {
                    child.children[i].transformComponent.absOrigin[Math.Z] -= this.zReset;
                    child.children[i].transformComponent.updateTransform();
                    if(child.children[i].type == EntityType.ENTITY_SPEAKER) {
                        child.children[i].updateSoundPos();
                    }
                  }
              }
              child.transformComponent.absOrigin[Math.Z] -= this.zReset;
              child.transformComponent.updateTransform();
              break;
            case EntityType.ENTITY_SPAWNER:
              // Apply history change.
              for (var i = 0; i < child.history.portals.length; i++) {
                child.history.portals[i][Math.Z] -= this.zReset;
              }
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
