class Pillar extends Entity {
    constructor(eid, owner) {
        super(eid, owner, EntityType.ENTITY_PILLAR);

        // Add entity components.
        this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);
        this.componentFactory.construct(ComponentID.COMPONENT_MESH);
        this.componentFactory.construct(ComponentID.COMPONENT_PHYSICS);

        this.physicsComponent = this.getComponent(ComponentID.COMPONENT_PHYSICS);
        this.transformComponent = this.getComponent(ComponentID.COMPONENT_TRANSFORM);
        this.meshComponent = this.getComponent(ComponentID.COMPONENT_MESH);

        // Define entity's collision type.
        this.physicsComponent.collisionType = CollisionType.COLLISION_SOLID;

        // Assign mesh.
        var assets = Assets.getInstance();
        this.meshComponent.setModel(
          assets.getModel("pillar")
        );

        this.meshComponent.setMaterial(
            assets.getMaterial("Pillar")
        );
    }
    setupMaterial(gl) {
        var cTime = Timer.getInstance().getCurrentTime() - this.spawnTime,
            red = (Math.sin(cTime / 500) * 0.5 + 0.5);
        var program = this.meshComponent.material.renderPrograms[0];

        gl.uniform4f(
            program.uniformLocation("u_BeaconColor"),
            red,
            0.0,
            0.0,
            1.0
        );
    }
    checkForMiss() {
      var position = this.transformComponent.absOrigin,
          playerPosition = this.owner.player.transformComponent.absOrigin;

      // Check if behind player, and remove.
      if (position[Math.Z] - 50 > playerPosition[Math.Z]) {
        this.destroy();
      }
    }

    tick(dt) {
      this.checkForMiss();
      this.physicsComponent.physicsSimulate(dt);
      this.transformComponent.updateTransform();
      super.tick(dt);
    }

};
EntityType.ENTITY_PILLAR.construction = (owner) => {
    return new Pillar(
        newID++,
        owner
    );
}
