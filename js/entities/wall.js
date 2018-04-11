class Wall extends Entity {
    constructor(eid, owner) {
        super(eid, owner, EntityType.ENTITY_WALL);

        // Add entity components.
        this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);
        this.componentFactory.construct(ComponentID.COMPONENT_MESH);

        this.transformComponent = this.getComponent(ComponentID.COMPONENT_TRANSFORM);
        this.meshComponent = this.getComponent(ComponentID.COMPONENT_MESH);

        // Assign mesh.
        var assets = Assets.getInstance();
        this.meshComponent.setModel(
          assets.getModel("wall")
        );

        this.meshComponent.shouldRender = false;
    }

    enable() {
      this.meshComponent.shouldRender = true;
      return true;
    }

    enableNext() {
      // Get all walls in game world.
      var children = this.getGameWorld().getChildren(EntityType.ENTITY_WALL),
          closest = children.length - 1;
      for (var i = 0; i < children.length; i++) {
        if (children[i].eid == this.eid) continue;

        var closestPosition = children[closest].transformComponent.absOrigin,
            newPosition = children[i].transformComponent.absOrigin;

        // Check if new closer to portal.
        if (closestPosition[Math.Z] < newPosition[Math.Z]) {
          closest = i;
        }
      }

      // Enable closest.
      if (children[closest]) {
        children[closest].enable();
      }
    }

    tick(dt) {
      this.transformComponent.updateTransform();
      super.tick(dt);
    }

    onCollisionOverlap(owner) {

    }
};
EntityType.ENTITY_WALL.construction = (owner) => {
    return new Wall(
        newID++,
        owner
    );
}
