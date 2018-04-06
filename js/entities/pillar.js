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
    }

    checkForMiss() {
      var position = this.transformComponent.absOrigin,
          playerPosition = this.owner.player.transformComponent.absOrigin;

      // Check if behind player, and remove.
      if (position[Math.Z] - 50 > playerPosition[Math.Z]) {
        for (var i = 0; i < this.owner.children.length; i++ ) {
          if (this.owner.children[i].eid == this.eid) {
            this.owner.children.splice(i, 1);
          }
        }
      }
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
EntityType.ENTITY_PILLAR.construction = (owner) => {
    return new Pillar(
        newID++,
        owner
    );
}
