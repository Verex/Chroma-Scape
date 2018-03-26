var MoveDirection = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3
}

class Player extends Entity {
    constructor(width, height, eid, owner) {
        super(eid, owner, EntityType.ENTITY_PLAYER);

        this.maxBounds = {
          x: 7.5,
          y: 4,
          yaw: 90,
          pitch: 90,
        }

        this.maxVelocity = 10;
        this.accelerationSpeed = 20;
        this.maxAngVelocity = 20;
        this.rotationSpeed = 4;

        // Assign movement control key codes.
        this.controls = {
          keyLeft: 'KeyA',
          keyRight: 'KeyD',
          keyUp: 'KeyW',
          keyDown: 'KeyS'
        };

        this.movement = {};
        this.movement[MoveDirection.UP] = false;
        this.movement[MoveDirection.DOWN] = false;
        this.movement[MoveDirection.LEFT] = false;
        this.movement[MoveDirection.RIGHT] = false;

        // Add components.
        this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);
        this.componentFactory.construct(ComponentID.COMPONENT_INPUT);
        this.componentFactory.construct(ComponentID.COMPONENT_PHYSICS);

        this.transformComponent = this.getComponent(ComponentID.COMPONENT_TRANSFORM);
        this.inputComponent = this.getComponent(ComponentID.COMPONENT_INPUT);
        this.physicsComponent = this.getComponent(ComponentID.COMPONENT_PHYSICS);

        this.physicsComponent.velocity[Math.Z] = -2;
        //this.physicsComponent.acceleration[Math.Z] = -50;
        this.transformComponent.absOrigin[Math.Y] = 10;
        this.cursorPosition = vec2.fromValues(-1, -1);

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
        )
    }
    onMouseMove(event) {
        this.cursorPosition = vec2.fromValues(
            event.offsetX,
            event.offsetY
        );
    }
    swayShip() {
        var globals = GlobalVars.getInstance();
        var x = 2 * this.cursorPosition[Math.X] / globals.clientWidth - 1;
        var y = 1 - (2 * this.cursorPosition[Math.Y] / globals.clientHeight);
        var pos = vec3.fromValues(x, y, 0);
        vec3.transformMat4(
            pos,
            pos,
            this.camera.getInvViewProjectionMatrix()
        );
    }

    moveShip(dt) {
      var velocity = this.ship.physicsComponent.velocity,
          angVelocity = this.ship.physicsComponent.angularVelocity,
          origin = this.ship.transformComponent.absOrigin,
          rotation = this.ship.transformComponent.absRotation;

      if (this.movement[MoveDirection.LEFT]
      && origin[Math.X] > -this.maxBounds.x) {
        this.ship.physicsComponent.velocity[Math.X] =
          Math.lerp(velocity[Math.X], -this.maxVelocity, this.accelerationSpeed * dt);

        this.ship.physicsComponent.angularVelocity[Math.YAW] =
          Math.lerp(angVelocity[Math.YAW], this.maxAngVelocity, this.rotationSpeed * dt);
      } else if (!this.movement[MoveDirection.RIGHT]) {
        this.ship.physicsComponent.velocity[Math.X] =
          Math.lerp(velocity[Math.X], 0, this.accelerationSpeed * dt);

        this.ship.physicsComponent.angularVelocity[Math.YAW] =
          Math.lerp(angVelocity[Math.YAW], 0, this.rotationSpeed * dt);

        this.ship.transformComponent.absRotation[Math.YAW] =
          Math.lerp(rotation[Math.YAW], 0, this.rotationSpeed * dt);
      }

      if (this.movement[MoveDirection.RIGHT]
      && origin[Math.X] < this.maxBounds.x) {
        this.ship.physicsComponent.velocity[Math.X] =
          Math.lerp(velocity[Math.X], this.maxVelocity, this.accelerationSpeed * dt);

          this.ship.physicsComponent.angularVelocity[Math.YAW] =
            Math.lerp(angVelocity[Math.YAW], -this.maxAngVelocity, this.rotationSpeed * dt);
      } else if (!this.movement[MoveDirection.LEFT]) {
        this.ship.physicsComponent.velocity[Math.X] =
          Math.lerp(velocity[Math.X], 0, this.accelerationSpeed * dt);

          this.ship.physicsComponent.angularVelocity[Math.YAW] =
            Math.lerp(angVelocity[Math.YAW], 0, this.rotationSpeed * dt);
          this.ship.transformComponent.absRotation[Math.YAW] =
            Math.lerp(rotation[Math.YAW], 0, this.rotationSpeed * dt);
      }

      // Downward movement.
      if (this.movement[MoveDirection.DOWN]
      && origin[Math.Y] > -this.maxBounds.y) {
        this.ship.physicsComponent.velocity[Math.Y] =
          Math.lerp(velocity[Math.Y], -this.maxVelocity, this.accelerationSpeed * dt);

          this.ship.physicsComponent.angularVelocity[Math.PITCH] =
            Math.lerp(angVelocity[Math.PITCH], -this.maxAngVelocity, this.rotationSpeed * dt);
      } else if (!this.movement[MoveDirection.UP]) {
        this.ship.physicsComponent.velocity[Math.Y] =
          Math.lerp(velocity[Math.Y], 0, this.accelerationSpeed * dt);

          this.ship.physicsComponent.angularVelocity[Math.PITCH] =
            Math.lerp(angVelocity[Math.PITCH], 0, this.rotationSpeed * dt);
          this.ship.transformComponent.absRotation[Math.PITCH] =
            Math.lerp(rotation[Math.PITCH], 0, this.rotationSpeed * dt);
      }

      // Upward movement.
      if (this.movement[MoveDirection.UP]
      && origin[Math.Y] < this.maxBounds.y) {
        this.ship.physicsComponent.velocity[Math.Y] =
          Math.lerp(velocity[Math.Y], this.maxVelocity, this.accelerationSpeed * dt);

        this.ship.physicsComponent.angularVelocity[Math.PITCH] =
          Math.lerp(angVelocity[Math.PITCH], this.maxAngVelocity, this.rotationSpeed * dt);
      } else if (!this.movement[MoveDirection.DOWN]) {
        this.ship.physicsComponent.velocity[Math.Y] =
          Math.lerp(velocity[Math.Y], 0, this.accelerationSpeed * dt);

          this.ship.physicsComponent.angularVelocity[Math.PITCH] =
            Math.lerp(angVelocity[Math.PITCH], 0, this.rotationSpeed * dt);

          this.ship.transformComponent.absRotation[Math.PITCH] =
            Math.lerp(rotation[Math.PITCH], 0, this.rotationSpeed * dt);
      }

      // Cancel vertical movement for direction conflict.
      if ((this.movement[MoveDirection.UP] && this.movement[MoveDirection.DOWN])){
        this.ship.physicsComponent.velocity[Math.Y] =
          Math.lerp(velocity[Math.Y], 0, this.accelerationSpeed * dt);

          this.ship.physicsComponent.angularVelocity[Math.PITCH] =
            Math.lerp(angVelocity[Math.PITCH], 0, this.rotationSpeed * dt);
          this.ship.transformComponent.absRotation[Math.PITCH] =
            Math.lerp(rotation[Math.PITCH], 0, this.rotationSpeed * dt);
      }

      // Cancel horizontal movement for direction conflict.
      if ((this.movement[MoveDirection.LEFT] && this.movement[MoveDirection.RIGHT])){
        this.ship.physicsComponent.velocity[Math.X] =
          Math.lerp(velocity[Math.X], 0, this.accelerationSpeed * dt);

          this.ship.physicsComponent.angularVelocity[Math.YAW] =
            Math.lerp(angVelocity[Math.YAW], 0, this.rotationSpeed * dt);
          this.ship.transformComponent.absRotation[Math.YAW] =
            Math.lerp(rotation[Math.YAW], 0, this.rotationSpeed * dt);
      }
    }

    tick(dt) {
        if(this.cursorPosition[0] !== -1 && this.cursorPosition[1] !== -1) {
            this.swayShip();
        }


        //this.physicsComponent.velocity[Math.Z] = Math.lerp(this.physicsComponent.velocity[Math.Z], -200, 0.00001);

        this.moveShip(dt);

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
