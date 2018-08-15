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

        this.gpSensitivity = 0.80;
        this.gpInvertedY = true;

        // Add components.
        this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);
        this.componentFactory.construct(ComponentID.COMPONENT_INPUT);
        this.componentFactory.construct(ComponentID.COMPONENT_PHYSICS);

        this.transformComponent = this.getComponent(ComponentID.COMPONENT_TRANSFORM);
        this.inputComponent = this.getComponent(ComponentID.COMPONENT_INPUT);
        this.physicsComponent = this.getComponent(ComponentID.COMPONENT_PHYSICS);

        // Set initial physics parameters.
        this.physicsComponent.maxVelocity = 900;
        this.physicsComponent.velocity[Math.Z] = -80;

        // Translate player position.
        this.transformComponent.absOrigin[Math.Y] = 10;

        this.cursorPosition = vec2.fromValues(-1, -1);
        this.color = WHITE;
        this.hasCrashed = false;

        var timer = Timer.getInstance();

        timer.createRelativeTimer("COLORCHECK", 150, () => {
          var c1 = this.mouseClicked[0] || this.inputComponent.gpButton(gameControls.gpColor0).pressed,
              c2 = this.mouseClicked[1] || this.inputComponent.gpButton(gameControls.gpColor1).pressed;

          this.color = COLORSET[0];
          if(c1) this.color = COLORSET[1];
          if(c2) this.color = COLORSET[2];
          if(c1 && c2) {
            this.color = COLORSET[3];
          }
        }, this, null, true);

        // Register movement callbacks.
        this.inputComponent.registerKeyboardEvent(
          gameControls.keyRight,
          () => {this.movement[MoveDirection.RIGHT] = true;},
          () => {this.movement[MoveDirection.RIGHT] = false;}
        );
        this.inputComponent.registerKeyboardEvent(
          gameControls.keyLeft,
          () => {this.movement[MoveDirection.LEFT] = true;},
          () => {this.movement[MoveDirection.LEFT] = false;}
        );
        this.inputComponent.registerKeyboardEvent(
          gameControls.keyUp,
          () => {this.movement[MoveDirection.UP] = true;},
          () => {this.movement[MoveDirection.UP] = false;}
        );
        this.inputComponent.registerKeyboardEvent(
          gameControls.keyDown,
          () => {this.movement[MoveDirection.DOWN] = true;},
          () => {this.movement[MoveDirection.DOWN] = false;}
        );
        this.inputComponent.registerKeyboardEvent(
          gameControls.color0,
          () => {this.mouseClicked[0] = true;},
          () => {this.mouseClicked[0] = false;}
        );
        this.inputComponent.registerKeyboardEvent(
          gameControls.color1,
          () => {this.mouseClicked[1] = true;},
          () => {this.mouseClicked[1] = false;}
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
          gameControls.color0,
          () => {this.mouseClicked[0] = true;},
          () => {this.mouseClicked[0] = false;}
        );
        this.inputComponent.registerKeyboardEvent(
          gameControls.color1,
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

    onCollisionOverlap(other) {
      if(other.owner.type == EntityType.ENTITY_PORTAL) {
        this.physicsComponent.maxVelocity += 1;
      }
    }

    crash() {
      if(god) {
        return;
      }
      this.physicsComponent.velocity = vec3.fromValues(0, 0, 0);
      this.physicsComponent.acceleration = vec3.fromValues(0, 0, 0);
      this.hasCrashed = true;
      this.getGameWorld().onPlayerCrashed();
      this.getGameWorld().gamestate.currentState = GameStates.GAMESTATE_MENU;
    }

    moveCamera(dt) {
      if(this.getGameWorld().gamestate.currentState != GameStates.GAMESTATE_GAME) return;

      var cameraPosition = this.camera.transformComponent.absOrigin,
          cameraRotation = this.camera.transformComponent.absRotation,
          shipPosition = this.ship.transformComponent.absOrigin;

      var rollScale = this.ship.getSwayScale(Math.ROLL), pitchScale = this.ship.getSwayScale(Math.PITCH);

      // Interpolate the camera's X and Y position.
      this.camera.transformComponent.absOrigin[Math.X] = Math.lerp(cameraPosition[Math.X], shipPosition[Math.X], 1 - Math.pow(0.01, dt));
      this.camera.transformComponent.absOrigin[Math.Y] = Math.lerp(cameraPosition[Math.Y], shipPosition[Math.Y] + 10, 1 - Math.pow(0.02, dt));

      var targetDistance = 50, zoomDistance = 8, zoomFactor = 0.12;

      if (rollScale != 0) {
        targetDistance -= zoomDistance * Math.abs(rollScale);
        zoomFactor = 0.32;
      }
      
      if (pitchScale != 0) {
        targetDistance -= zoomDistance * Math.abs(pitchScale);
        zoomFactor = 0.32;
      }

      this.camera.transformComponent.absOrigin[Math.Z] = Math.lerp(cameraPosition[Math.Z], targetDistance, 1 - Math.pow(zoomFactor, dt));

      var maxRoll = 20, maxYaw = 25, maxPitch = 28;
      var rollTarget = maxRoll * rollScale, 
          yawTarget = maxYaw * rollScale, 
          pitchTarget = maxPitch * pitchScale - 10;

      var rollFactor = 0.25, yawFactor = 0.22, pitchFactor = 0.22;

      if (Math.between(-0.2, 0.2, rollScale)) {
        rollFactor = 0.12;
        yawFactor = 0.1;
      } else {
        rollFactor -= 0.08 * rollScale;
        pitchFactor -= 0.08 * rollScale;
      }

      if (Math.between(-0.2, 0.2, pitchScale)) {
        pitchFactor = 0.15;
      } else {
        pitchFactor -= 0.02 * pitchScale;
      }

      // Interpolate camera rotations.
      this.camera.transformComponent.absRotation[Math.ROLL] = Math.lerp(cameraRotation[Math.ROLL], rollTarget, 1 - Math.pow(rollFactor, dt));
      this.camera.transformComponent.absRotation[Math.YAW] = Math.lerp(cameraRotation[Math.YAW], yawTarget, 1 - Math.pow(yawFactor, dt));
      this.camera.transformComponent.absRotation[Math.PITCH] = Math.lerp(cameraRotation[Math.PITCH], pitchTarget, 1 - Math.pow(pitchFactor, dt));
    }

    tick(dt) {
      if(this.getGameWorld().gamestate.currentState >= GameStates.GAMESTATE_GAMEOVER) return;

      this.moveCamera(dt);
      this.inputComponent.updateGamepads();
      this.physicsComponent.physicsSimulate(dt);
      this.transformComponent.updateTransform();

      var worldTranslation = this.ship.transformComponent.getWorldTranslation();
      var worldOrientation = this.transformComponent.getWorldRotation();
      var upVector = this.transformComponent.upVector;

      Howler.pos(worldTranslation[Math.X], worldTranslation[Math.Y], worldTranslation[Math.Z]);

      /*
      //Update the howler listen position and orientation
      //TODO(Any): Maybe put this inside of a microphone component or something.
      Howler._pos = worldTranslation;
      Howler.orientation(
        worldOrientation[Math.PITCH],
        worldOrientation[Math.YAW],
        worldOrientation[Math.ROLL],
        upVector[Math.X],
        upVector[Math.Y],
        upVector[Math.Z]
      );
      */

      super.tick(dt);
    }
};

EntityType.ENTITY_PLAYER.construction = (owner) => {
    return new Player(
        newID++,
        owner
    );
}
