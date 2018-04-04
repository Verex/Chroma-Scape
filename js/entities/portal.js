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
      var position = this.transformComponent.absOrigin,
          playerPosition = this.owner.player.transformComponent.absOrigin;
      if (position[Math.Z] > playerPosition[Math.Z]) {
        if (this.disabled) {
          for (var i = 0; i < this.owner.children.length; i++ ) {
            if (this.owner.children[i].eid == this.eid) {
              this.owner.children.splice(i, 1);
            }
          }
        } else {
          this.owner.player.crash();
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
EntityType.ENTITY_PORTAL.construction = (owner) => {
    return new Portal(
        newID++,
        owner
    );
}
