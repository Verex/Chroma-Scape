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
    constructor(width, height, eid, owner) {
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
          keyDown: 'KeyS'
        };

        // Add components.
        this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);
        this.componentFactory.construct(ComponentID.COMPONENT_INPUT);
        this.componentFactory.construct(ComponentID.COMPONENT_PHYSICS);

        this.transformComponent = this.getComponent(ComponentID.COMPONENT_TRANSFORM);
        this.inputComponent = this.getComponent(ComponentID.COMPONENT_INPUT);
        this.physicsComponent = this.getComponent(ComponentID.COMPONENT_PHYSICS);

        this.physicsComponent.velocity[Math.Z] = -30;
        //this.physicsComponent.acceleration[Math.Z] = -10;
        //this.transformComponent.absOrigin[Math.Y] = 10;
        this.cursorPosition = vec2.fromValues(-1, -1);
        this.color = WHITE;

        var timer = Timer.getInstance();
        var colorCheck = (thisptr) => {

        };
        timer.createRelativeTimer("COLORCHECK", 250, () => {
          this.color = WHITE;
          if(this.mouseClicked[0]) this.color = RED;
          if(this.mouseClicked[1]) this.color = BLUE;
          if(this.mouseClicked[1] && this.mouseClicked[0]) {
            this.color = GREEN;
          }
        }, this, null, true);


        /*
        this.inputComponent.registerEvent(
          InputMethod.INPUT_KEYBOARD,
          InputType.BTN_PRESS,
          'KeyA',
          (event) => {
            this.children[0].transformComponent.absOrigin[Math.X] -= 0.1;
          }
        );

        */

        // Register movement callbacks.
        this.inputComponent.registerKeyboardEvent(
          'KeyD',
          (event) => {
            this.movement[MoveDirection.RIGHT] = true;
          },
          (event) => {
            this.movement[MoveDirection.RIGHT] = false;
          }
        );

        this.inputComponent.registerKeyboardEvent(
          'KeyA',
          (event) => {
            this.movement[MoveDirection.LEFT] = true;
          },
          (event) => {
            this.movement[MoveDirection.LEFT] = false;
          }
        );

        this.inputComponent.registerKeyboardEvent(
          'KeyW',
          () => {
            this.movement[MoveDirection.UP] = true;
          },
          () => {
            this.movement[MoveDirection.UP] = false;
          }
        );

        this.inputComponent.registerKeyboardEvent(
          'KeyS',
          () => {
            this.movement[MoveDirection.DOWN] = true;
          },
          () => {
            this.movement[MoveDirection.DOWN] = false;
          }
        );

        this.inputComponent.registerKeyboardEvent(
          'KeyX',
          (event) => {
            this.ship.physicsComponent.angularVelocity[Math.YAW] = 50;
          },
          (event) => {
            this.ship.physicsComponent.angularVelocity[Math.YAW] = 0;
          }
        );

        this.inputComponent.registerKeyboardEvent(
          'KeyZ',
          (event) => {
            this.ship.physicsComponent.angularVelocity[Math.YAW] = -50;
          },
          (event) => {
            this.ship.physicsComponent.angularVelocity[Math.YAW] = 0;
          }
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
    }

    onMouseMove(event) {
        this.cursorPosition = vec2.fromValues(
            event.offsetX,
            event.offsetY
        );
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
      this.physicsComponent.velocity = vec3.fromValues(0, 0, 0);
      this.physicsComponent.acceleration = vec3.fromValues(0, 0, 0);
    }

    tick(dt) {
      this.physicsComponent.physicsSimulate(dt);
      this.transformComponent.updateTransform();
      super.tick(dt);
    }
};

EntityType.ENTITY_PLAYER.construction = (owner) => {
    var globals = GlobalVars.getInstance();
    return new Player(
        globals.clientWidth,
        globals.clientHeight,
        newID++,
        owner
    );
}