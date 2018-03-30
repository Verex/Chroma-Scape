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

        var cidx = Math.randInt(0, 3);
        switch(cidx) {
            case 0: this.col = RED; break;
            case 1: this.col = GREEN; break;
            case 2: this.col = BLUE; break;
            case 3: this.col = WHITE; break;
        }

        this.color = this.col.serialize();

        this.disabled = false;
    }

    checkForMiss() {
      this.children.forEach((child) => {
        if (!child.disabled && child.transformComponent.absOrigin[Math.Z] - 10
          > owner.player.transformComponent.absOrigin[Math.Z]) {
          player.crash();
        }
      });
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
