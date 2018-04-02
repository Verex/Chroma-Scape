var MoveDirection = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3
}

var PortalType = {
  NONE: 0,
  LEFT: 1,
  RIGHT: 2,
  BOTH: 3
}

class Player extends Entity {
    constructor(eid, owner) {
        super(eid, owner, EntityType.ENTITY_PLAYER);

        // Define directional movement conditions.
        this.movement = {};
        this.movement[MoveDirection.UP] = false;
        this.movement[MoveDirection.DOWN] = false;
        this.movement[MoveDirection.LEFT] = false;
        this.movement[MoveDirection.RIGHT] = false;

        this.mouseClicked = [];
        this.mouseClicked[0] = false;
        this.mouseClicked[2] = false;
        this.mouseClicked[1] = false;

        // Assign movement control key codes.
        this.controls = {
          keyLeft: 'KeyA',
          keyRight: 'KeyD',
          keyUp: 'KeyW',
          keyDown: 'KeyS',
          color0: 'KeyJ',
          color1: 'KeyL'
        };

        // Add components.
        this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);
        this.componentFactory.construct(ComponentID.COMPONENT_INPUT);
        this.componentFactory.construct(ComponentID.COMPONENT_PHYSICS);

        this.transformComponent = this.getComponent(ComponentID.COMPONENT_TRANSFORM);
        this.inputComponent = this.getComponent(ComponentID.COMPONENT_INPUT);
        this.physicsComponent = this.getComponent(ComponentID.COMPONENT_PHYSICS);

        // Set initial physics parameters.
        this.physicsComponent.maxVelocity = 800;
        this.physicsComponent.velocity[Math.Z] = -30;
        this.physicsComponent.acceleration[Math.Z] = -1;

        // Translate player position.
        this.transformComponent.absOrigin[Math.Y] = 10;

        this.cursorPosition = vec2.fromValues(-1, -1);
        this.color = WHITE;

        var timer = Timer.getInstance();
        timer.createRelativeTimer("COLORCHECK", 250, () => {
          this.color = WHITE;
          if(this.mouseClicked[0]) this.color = RED;
          if(this.mouseClicked[1]) this.color = BLUE;
          if(this.mouseClicked[1] && this.mouseClicked[0]) {
            this.color = GREEN;
          }
        }, this, null, true);

        // Register movement callbacks.
        this.inputComponent.registerKeyboardEvent(
          this.controls.keyRight,
          () => {this.movement[MoveDirection.RIGHT] = true;},
          () => {this.movement[MoveDirection.RIGHT] = false;}
        );
        this.inputComponent.registerKeyboardEvent(
          this.controls.keyLeft,
          () => {this.movement[MoveDirection.LEFT] = true;},
          () => {this.movement[MoveDirection.LEFT] = false;}
        );
        this.inputComponent.registerKeyboardEvent(
          this.controls.keyUp,
          () => {this.movement[MoveDirection.UP] = true;},
          () => {this.movement[MoveDirection.UP] = false;}
        );
        this.inputComponent.registerKeyboardEvent(
          this.controls.keyDown,
          () => {this.movement[MoveDirection.DOWN] = true;},
          () => {this.movement[MoveDirection.DOWN] = false;}
        );

        this.inputComponent.registerEvent(
            InputMethod.INPUT_MOUSE,
            InputType.MSE_MOVE,
            null,
            (event) => { this.onMouseMove(event); }
        );

        this.inputComponent.registerEvent(
          InputMethod.INPUT_MOUSE,
          InputType.MSE_PRESS,
          null,
          (event) => { this.onMouseClick(event); }
        );

        this.inputComponent.registerEvent(
          InputMethod.INPUT_MOUSE,
          InputType.MSE_RELEASE,
          null,
          (event) => { this.onMouseClick(event); }
        );

        this.inputComponent.registerKeyboardEvent(
          this.controls.color0,
          () => {this.mouseClicked[0] = true;},
          () => {this.mouseClicked[0] = false;}
        );
        this.inputComponent.registerKeyboardEvent(
          this.controls.color1,
          () => {this.mouseClicked[1] = true;},
          () => {this.mouseClicked[1] = false;}
        );
    }

    onMouseMove(event) {
    }

    onMouseClick(event) {
      this.mouseClicked.fill(false);
      switch(event.buttons) {
        case 0: this.mouseClicked.fill(false); break;
        case 1: this.mouseClicked[0] = true; break;
        case 2: this.mouseClicked[1] = true; break;
        case 3: this.mouseClicked.fill(true); break;
      }
    }

    onCollisionOverlap(owner) {
    }

    crash() {
      console.log("We have crashed.");
      this.physicsComponent.velocity = vec3.fromValues(0, 0, 0);
      this.physicsComponent.acceleration = vec3.fromValues(0, 0, 0);
    }

    moveCamera(dt) {
      var cameraPosition = this.camera.transformComponent.absOrigin,
          shipPosition = this.ship.transformComponent.absOrigin;

      // Interpolate the camera's X and Y position.
      this.camera.transformComponent.absOrigin[Math.X] = Math.lerp(cameraPosition[Math.X], shipPosition[Math.X], 3 * dt);
      this.camera.transformComponent.absOrigin[Math.Y] = Math.lerp(cameraPosition[Math.Y], shipPosition[Math.Y] + 10, 2 * dt);
    }

    tick(dt) {
      this.moveCamera(dt);
      this.physicsComponent.physicsSimulate(dt);
      this.transformComponent.updateTransform();
      super.tick(dt);
    }
};

EntityType.ENTITY_PLAYER.construction = (owner) => {
    return new Player(
        newID++,
        owner
    );
}
