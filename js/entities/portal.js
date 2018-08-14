class Portal extends Entity {
    constructor(eid, owner) {
        super(eid, owner, EntityType.ENTITY_PORTAL);

        // Add entity components.
        this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);
        this.componentFactory.construct(ComponentID.COMPONENT_MESH);
        this.componentFactory.construct(ComponentID.COMPONENT_PHYSICS);

        this.physicsComponent = this.getComponent(ComponentID.COMPONENT_PHYSICS);
        this.transformComponent = this.getComponent(ComponentID.COMPONENT_TRANSFORM);
        this.meshComponent = this.getComponent(ComponentID.COMPONENT_MESH);

        // Define entity's collision type.
        this.physicsComponent.collisionType = CollisionType.COLLISION_SOLID;

        // Define entity's AABB.
        this.physicsComponent.aabb = new AABB(this, 20 ,20, 10);

        // Scale the entity.
        this.transformComponent.absScale = vec3.fromValues(10, 10, 4);

        // Assign mesh.
        var assets = Assets.getInstance();
        this.meshComponent.setModel(
          assets.getModel("portal")
        );

        this.meshComponent.setMaterial(
          assets.getMaterial("Portal")
        );

        var cidx = Math.randInt(0, 3);
        this.color = COLORSET[cidx];

        this.disabled = false;
    }

    checkForMiss() {
      var position = this.transformComponent.absOrigin,
          playerPosition = this.owner.player.transformComponent.absOrigin;
      if (position[Math.Z] + 5 > playerPosition[Math.Z]) {
        if (this.disabled || god) {
          // Destroy associated wall entity.
          if (this.wall) {
            this.wall.enableNext();
            this.wall.destroy();
          }

          // Destroy entity.
          this.destroy();
        } else {
          this.owner.player.crash();
        }
      }
    }
    setupMaterial(gl) {
      var color = this.color.serialize();
      var program = this.meshComponent.material.renderPrograms[0];
      gl.uniform4f(
                program.uniformLocation("u_PortalColor"),
                color[0],
                color[1],
                color[2],
                color[3]
      );
    }
    tick(dt) {
      this.checkForMiss();
      this.physicsComponent.physicsSimulate(dt);
      this.transformComponent.updateTransform();
      super.tick(dt);
    }

    onCollisionOverlap(owner) {

    }
};
EntityType.ENTITY_PORTAL.construction = (owner) => {
    return new Portal(
        newID++,
        owner
    );
}
