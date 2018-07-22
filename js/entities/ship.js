class Ship extends Entity {
    constructor(eid, owner) {
        super(eid, owner, EntityType.ENTITY_SHIP);

        // Add entity components.
        this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);
        this.componentFactory.construct(ComponentID.COMPONENT_MESH);
        this.componentFactory.construct(ComponentID.COMPONENT_PHYSICS);

        this.transformComponent = this.getComponent(ComponentID.COMPONENT_TRANSFORM);
        this.physicsComponent = this.getComponent(ComponentID.COMPONENT_PHYSICS);
        this.meshComponent = this.getComponent(ComponentID.COMPONENT_MESH);

        // Set model for our ship.
        this.meshComponent.setModel(
          Assets.getInstance().getModel("ship")
        );


        // Assign physics component parameters.
        this.physicsComponent.collisionType = CollisionType.COLLISION_SOLID;
        this.physicsComponent.maxAngularVelocity = 90;
        this.physicsComponent.maxVelocity = 60;

        // Define linear boundaries.
        this.linearBounds = {};
        this.linearBounds[Math.X] = {min: -80, max: 80};
        this.linearBounds[Math.Y] = {min: 1, max: 60};
        this.linearBounds[Math.Z] = {min: 0, max: 0};

        // Define angular boundaries.
        this.angularBounds = {};
        this.angularBounds[Math.PITCH] = {min: -25, max: 25};
        this.angularBounds[Math.YAW] = {min: -25, max: 25};
        this.angularBounds[Math.ROLL] = {min: -30, max: 30};
    }

    getSwayScale(axis) {
      return 1 + (
        (this.transformComponent.absRotation[axis] - this.angularBounds[axis].max)
        / this.angularBounds[axis].max
      );
    }

    handleMovement(dt) {
      if (this.owner.inputComponent.hasGamepad) {
        // Gamepad control method.

        // Disable gamepad controls for main menu.
        if(this.getGameWorld().gamestate.currentState != GameStates.GAMESTATE_GAME) return;

        // Get left joystick axes.
        var joystick = [
          this.owner.inputComponent.gpAxis(0),
          this.owner.inputComponent.gpAxis(1)
        ];

        var horizontalDirection = MoveDirection.LEFT,
            verticalDirection = (this.owner.gpInvertedY ? MoveDirection.DOWN : MoveDirection.UP);

        if (joystick[0] > 0) {
          horizontalDirection = MoveDirection.RIGHT;
        }

        if (joystick[1] > 0) {
          verticalDirection = (this.owner.gpInvertedY ? MoveDirection.UP : MoveDirection.DOWN);
        }

        if (Math.abs(joystick[0]) > 0.2 && this.canSway(horizontalDirection)) {
          this.physicsComponent.angularVelocity[Math.ROLL] =
            (this.physicsComponent.maxAngularVelocity * this.owner.gpSensitivity) * -joystick[0];
        } else {
          this.physicsComponent.angularVelocity[Math.ROLL] = 0;

          // Return roll to origin.
          this.transformComponent.absRotation[Math.ROLL] =
            Math.lerp(
              this.transformComponent.absRotation[Math.ROLL],
              0,
              8 * dt
            );
        }

        if (Math.abs(joystick[1]) > 0.2 && this.canSway(verticalDirection)) {
          this.physicsComponent.angularVelocity[Math.PITCH] =
            (this.physicsComponent.maxAngularVelocity * this.owner.gpSensitivity)
            * (this.owner.gpInvertedY ? 1 : -1) * joystick[1];
        } else {
          this.physicsComponent.angularVelocity[Math.PITCH] = 0;

          // Return roll to origin.
          this.transformComponent.absRotation[Math.PITCH] =
            Math.lerp(
              this.transformComponent.absRotation[Math.PITCH],
              0,
              8 * dt
            );
        }
      } else {
        // Default keyboard control method.

        // Get move conditions.
        var move = {
          up: this.owner.movement[MoveDirection.UP] && this.canSway(MoveDirection.UP),
          down: this.owner.movement[MoveDirection.DOWN] && this.canSway(MoveDirection.DOWN),
          left: this.owner.movement[MoveDirection.LEFT] && this.canSway(MoveDirection.LEFT),
          right: this.owner.movement[MoveDirection.RIGHT] && this.canSway(MoveDirection.RIGHT)
        };

        /*
          Check for horizontal movement.
        */
        if (move.left) {
          this.physicsComponent.angularVelocity[Math.ROLL] = this.physicsComponent.maxAngularVelocity;
        } else if (move.right) {
          this.physicsComponent.angularVelocity[Math.ROLL] = -this.physicsComponent.maxAngularVelocity;
        } else {
          this.physicsComponent.angularVelocity[Math.ROLL] = 0;

          // Return roll to origin.
          this.transformComponent.absRotation[Math.ROLL] =
            Math.lerp(
              this.transformComponent.absRotation[Math.ROLL],
              0,
              8 * dt
            );
        }

        /*
          Check for vertical movement.
        */
        if (move.up) {
          this.physicsComponent.angularVelocity[Math.PITCH] = this.physicsComponent.maxAngularVelocity;
        } else if (move.down) {
          this.physicsComponent.angularVelocity[Math.PITCH] = -this.physicsComponent.maxAngularVelocity;
        } else {
          this.physicsComponent.angularVelocity[Math.PITCH] = 0;

          // Return pitch to origin.
          this.transformComponent.absRotation[Math.PITCH] =
            Math.lerp(
              this.transformComponent.absRotation[Math.PITCH],
              0,
              8 * dt
            );
        }
      }
    }

    move(dt) {
      this.handleMovement(dt);

      var hScale = this.getSwayScale(Math.ROLL),
          vScale = this.getSwayScale(Math.PITCH);

      this.physicsComponent.velocity[Math.X] = -this.physicsComponent.maxVelocity * hScale;
      this.physicsComponent.velocity[Math.Y] = this.physicsComponent.maxVelocity * vScale;

      // Enforce velocity bounds.
      for (var axis = 0; axis < 3; axis++) {
        if (this.transformComponent.absOrigin[axis] > this.linearBounds[axis].max) {
          this.transformComponent.absOrigin[axis] = this.linearBounds[axis].max;
          this.physicsComponent.velocity[axis] = 0;
        } else if (this.transformComponent.absOrigin[axis] < this.linearBounds[axis].min) {
          this.transformComponent.absOrigin[axis] = this.linearBounds[axis].min;
          this.physicsComponent.velocity[axis] = 0;
        }

        if (this.transformComponent.absRotation[axis] > this.angularBounds[axis].max) {
          this.transformComponent.absRotation[axis] = this.angularBounds[axis].max;
          this.physicsComponent.angularVelocity[axis] = 0;
        } else if (this.transformComponent.absRotation[axis] < this.angularBounds[axis].min) {
          this.transformComponent.absRotation[axis] = this.angularBounds[axis].min;
          this.physicsComponent.angularVelocity[axis] = 0;
        }
      }
    }

    onCollisionOverlap(other) {
      if(other.owner.type == EntityType.ENTITY_PORTAL) {
        if(this.owner.color === other.owner.color) {
          other.owner.disabled = true;
          this.getGameWorld().onPortalClosed();
          this.owner.onCollisionOverlap(other);
        } else {
          this.owner.crash();
        }
      } else if (other.owner.type == EntityType.ENTITY_PILLAR) {
        this.owner.crash();
      }
    }

    canSway(direction) {
      var opposite = null,
          positionAxis = null,
          rotationAxis = null,
          minInclude = false,
          maxInclude = false;

      switch(direction) {
        case MoveDirection.UP:
          opposite = MoveDirection.DOWN;
          positionAxis = Math.Y;
          rotationAxis = Math.PITCH;
          minInclude = true;
          break;
        case MoveDirection.DOWN:
          opposite = MoveDirection.UP;
          positionAxis = Math.Y;
          rotationAxis = Math.PITCH;
          maxInclude = true;
          break;
        case MoveDirection.LEFT:
          opposite = MoveDirection.RIGHT;
          positionAxis = Math.X;
          rotationAxis = Math.ROLL;
          maxInclude = true;
          break;
        case MoveDirection.RIGHT:
          opposite = MoveDirection.LEFT;
          positionAxis = Math.X;
          rotationAxis = Math.ROLL;
          minInclude = true;
          break;
      }

      var usingGamepad = this.owner.inputComponent.gamepad != -1,
          withinBounds =
            Math.between(
              this.angularBounds[rotationAxis].min,
              this.angularBounds[rotationAxis].max,
              this.transformComponent.absRotation[rotationAxis],
              minInclude, maxInclude
            ) &&
            Math.between(
              this.linearBounds[positionAxis].min,
              this.linearBounds[positionAxis].max,
              this.transformComponent.absOrigin[positionAxis],
              minInclude, maxInclude
            );

      return (!this.owner.movement[opposite] || usingGamepad) && withinBounds;
    }

    tick(dt) {
        this.move(dt);
        this.physicsComponent.physicsSimulate(dt);
        this.transformComponent.updateTransform();
        this.physicsComponent.aabb.origin = this.transformComponent.getWorldTranslation();
        super.tick(dt);
    }
};

EntityType.ENTITY_SHIP.construction = (owner) => {
    return new Ship(
        newID++,
        owner
    );
}
