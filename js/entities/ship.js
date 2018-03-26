class Ship extends Entity {
    constructor(width, height, eid, owner) {
        super(eid, owner, EntityType.ENTITY_SHIP);

        // Add components.
        this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);
        this.componentFactory.construct(ComponentID.COMPONENT_MESH);
        this.componentFactory.construct(ComponentID.COMPONENT_PHYSICS);

        this.transformComponent = this.getComponent(ComponentID.COMPONENT_TRANSFORM);
        this.physicsComponent = this.getComponent(ComponentID.COMPONENT_PHYSICS);

        this.meshComponent = this.getComponent(ComponentID.COMPONENT_TRANSFORM);

        this.maxVelocity = {
          linear: 10,
          angular: 40
        }

        this.momentum = {
          linear: 0.8,
          angular: 0.8
        }

        this.bounds = {
          linear: [7.5, 5.5, 0],
          angular: [25, 90, 30]
        }
    }

    direct(axis, targetVelocity, momentum) {
      // Increment angular velocity towards target.
      this.physicsComponent.angularVelocity[axis] =
        Math.lerp(
          this.physicsComponent.angularVelocity[axis],
          targetVelocity,
          momentum
        );
    }

    accelerate(axis, targetVelocity, momentum) {
      // Increment linear velocity towards target.
      this.physicsComponent.velocity[axis] =
        Math.lerp(
          this.physicsComponent.velocity[axis],
          targetVelocity,
          momentum
        );
    }

    getSwayScale(axis) {
      return 1 + (
        (this.transformComponent.absRotation[axis] - this.bounds.angular[axis])
        / this.bounds.angular[axis]
      );
    }

    handleMovement(dt) {
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
        this.direct(
          Math.ROLL,
          this.maxVelocity.angular,
          10 * dt
        );
      } else if (move.right) {
        // Sway ship right.
        this.direct(
          Math.ROLL,
          -this.maxVelocity.angular,
          10 * dt
        );
      } else {
        // Stop horizontal sway.
        this.direct(Math.ROLL, 0, this.momentum.angular);

        // Return roll to origin.
        this.transformComponent.absRotation[Math.ROLL] =
          Math.lerp(
            this.transformComponent.absRotation[Math.ROLL],
            0,
            3 * dt
          );
      }

      /*
        Check for vertical movement.
      */
      if (move.up) {
        // Sway ship up.
        this.direct(
          Math.PITCH,
          this.maxVelocity.angular,
          this.momentum.angular
        );
      } else if (move.down) {
        // Sway ship down.
        this.direct(
          Math.PITCH,
          -this.maxVelocity.angular,
          this.momentum.angular
        );
      } else {
        // Stop vertical sway.
        this.direct(Math.PITCH, 0, this.momentum.angular);

        // Return pitch to origin.
        this.transformComponent.absRotation[Math.PITCH] =
          Math.lerp(
            this.transformComponent.absRotation[Math.PITCH],
            0,
            3 * dt
          );
      }
    }

    move(dt) {
      var hScale = this.getSwayScale(Math.ROLL),
          vScale = this.getSwayScale(Math.PITCH);
      this.accelerate(Math.X, -this.maxVelocity.linear * hScale, this.momentum.linear);
      this.accelerate(Math.Y, -this.maxVelocity.linear * -vScale, this.momentum.linear);

      // Enforce velocity bounds.
      for (var axis = 0; axis < 3; axis++) {
        if (this.transformComponent.absOrigin[axis] > this.bounds.linear[axis]) {
          this.transformComponent.absOrigin[axis] = this.bounds.linear[axis];
          this.physicsComponent.velocity[axis] = 0;
        } else if (this.transformComponent.absOrigin[axis] < -this.bounds.linear[axis]) {
          this.transformComponent.absOrigin[axis] = -this.bounds.linear[axis];
          this.physicsComponent.velocity[axis] = 0;
        }

        if (this.transformComponent.absRotation[axis] > this.bounds.angular[axis]) {
          this.transformComponent.absRotation[axis] = this.bounds.angular[axis];
          this.physicsComponent.angularVelocity[axis] = 0;
        } else if (this.transformComponent.absRotation[axis] < -this.bounds.angular[axis]) {
          this.transformComponent.absRotation[axis] = -this.bounds.angular[axis];
          this.physicsComponent.angularVelocity[axis] = 0;
        }
      }
    }

    canSway(direction) {
      var canSway = false,
          bound = 0, value = 0;

      switch(direction) {
        case MoveDirection.UP:
          canSway = !this.owner.movement[MoveDirection.DOWN];
          bound = this.bounds.angular[Math.PITCH];
          value = this.transformComponent.absRotation[Math.PITCH];
          break;
        case MoveDirection.DOWN:
          canSway = !this.owner.movement[MoveDirection.UP];
          bound = this.bounds.angular[Math.PITCH];
          value = this.transformComponent.absRotation[Math.PITCH];
          break;
        case MoveDirection.LEFT:
          canSway = !this.owner.movement[MoveDirection.RIGHT];
          bound = this.bounds.angular[Math.ROLL];
          value = this.transformComponent.absRotation[Math.ROLL];
          break;
        case MoveDirection.RIGHT:
          canSway = !this.owner.movement[MoveDirection.LEFT];
          bound = this.bounds.angular[Math.ROLL];
          value = this.transformComponent.absRotation[Math.ROLL];
          break;
      }

      return canSway && Math.between(-bound, bound, value);
    }

    tick(dt) {
        this.handleMovement(dt);
        this.move(dt);

        this.physicsComponent.physicsSimulate(dt);
        this.transformComponent.updateTransform();
        super.tick(dt);
    }
};

EntityType.ENTITY_SHIP.construction = (owner) => {
    var globals = GlobalVars.getInstance();
    return new Ship(
        globals.clientWidth,
        globals.clientHeight,
        newID++,
        owner
    );
}
