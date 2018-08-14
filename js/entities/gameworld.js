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
      this.componentFactory.construct(ComponentID.COMPONENT_INPUT);
      this.componentFactory.construct(ComponentID.COMPONENT_MESH);

      this.inputComponent = this.getComponent(ComponentID.COMPONENT_INPUT);
      this.meshComponent = this.getComponent(ComponentID.COMPONENT_MESH);
      this.audioComponent = this.getComponent(ComponentID.COMPONENT_AUDIO);

      this.audioComponent.sound = new Howl({
        src: ['./assets/sounds/sprites/effects.mp3'],
        sprite: {
          portal: [0, 6852, true],
          pass1: [6852, 7758],
          pass2: [7758, 8626],
          pass3: [8626, 9507]
        },
        volume: 0.25
      });


      this.startPressed = false;


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
          this.gamestate.currentState = GameStates.GAMESTATE_GAME;
        }
      );
      this.inputComponent.registerEvent(
        InputMethod.INPUT_KEYBOARD,
        InputType.BTN_RELEASE,
        'KeyF',
        (event) => {
            postProcessing = !postProcessing;
        }
      );

      this.inputComponent.registerEvent(
        InputMethod.INPUT_KEYBOARD,
        InputType.BTN_RELEASE,
        'KeyG',
        (event) => {
            god = !god;
            GlobalVars.getInstance().timescale = (god) ? 8.0 : 1.0;
        }
      );

      this.inputComponent.registerEvent(
          InputMethod.INPUT_KEYBOARD,
          InputType.BTN_RELEASE,
          'Enter',
          (event) => {
              if(this.gamestate.currentState == GameStates.GAMESTATE_MENU) {
                  this.gamestate.currentState = GameStates.GAMESTATE_MENUPAN;
              }
          }
      )
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

    onPlayerCrashed() {
        this.children.forEach((value, index, array) => {
            if(value.type == EntityType.ENTITY_PORTAL && value.speaker) {
                console.log("STOPPING");
                value.speaker.stop();
            }
        })

    }
    onPortalClosed() {
        this.audioComponent.playSound("pass3");
        this.audioComponent.setVolume(0.05);
    }

    getActiveCamera() {
        return this.scene.activeCamera;
    }

    onEntityCreated(newEnt) {
      switch(newEnt.type) {
          case EntityType.ENTITY_MENUCAMERA:
          case EntityType.ENTITY_CAMERA: //We need to add our camera to our scene
              console.log("NEW CAMERA!");
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
      this.gamestate.updateDifficultyCurve();
      this.gamestate.updateScore(dt);
      if(this.hudcontroller !== undefined) {
          this.hudcontroller.updateScore(this.gamestate.score);
      }
      if(this.gamestate.currentState == GameStates.GAMESTATE_MENU) {
          if(this.inputComponent.gpButton(0).pressed && !this.startPressed) {
              this.startPressed = true;
          }
          if(!this.inputComponent.gpButton(0).pressed && this.startPressed) {
              this.startPressed = false;
              this.gamestate.currentState = GameStates.GAMESTATE_MENUPAN;
          }
      }
      if(this.gamestate.currentState == GameStates.GAMESTATE_MENUPAN) {
          //var timefraction = GlobalVars.getInstance().curtime / this.turnTime;
          var boom = this.player.menuCamera.yawBoom;

          this.player.menuCamera.transformComponent.absOrigin[Math.Z] = Math.cos(Math.radians(boom)) * 50;
          this.player.menuCamera.transformComponent.absOrigin[Math.X] = Math.sin(Math.radians(boom)) * 50;
          this.player.menuCamera.transformComponent.absRotation[Math.YAW] = boom;

          this.player.menuCamera.yawBoom -= 35 * dt;

          if(this.player.menuCamera.yawBoom < 1) {
              this.player.menuCamera.yawBoom = 0;
              var timer = Timer.getInstance();
              timer.createRelativeTimer("GAMESTART", 1500, () => {
                  // Change current game state.
                  this.gamestate.currentState = GameStates.GAMESTATE_GAME;

                    // Update when we started the gameplay run.
                  GlobalVars.getInstance().gametime = GlobalVars.getInstance().curtime;

                  // Enable spawner.
                  this.spawner.enabled = true;

                  // Set initial acceleration for the player.
                  this.player.physicsComponent.acceleration[Math.Z] = -1.1;

                  // Change camera ID.
                  this.scene.mainCameraID = 0;
              }, this, null, false);
          }
      }
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
                    if(d < 200) {
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
