class Spawner extends Entity {
  constructor(eid, owner) {
    super(eid, owner, EntityType.ENTITY_SPAWNER);

    // Add components.
    this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);

    this.transformComponent = this.getComponent(ComponentID.COMPONENT_TRANSFORM);

    var timer = Timer.getInstance();
    timer.createRelativeTimer("PORTALSPAWN", 5000, () => {
      var x = Math.randInt(-40, 40),
          y = Math.randInt(10, 60);
      this.spawnPortal(vec3.fromValues(x, y, this.owner.player.transformComponent.absOrigin[Math.Z] - 500));
    }, this, null, true);
  }

  spawnPortal(position) {
    var assets = Assets.getInstance();
    var portal = new Entity.Factory(this.owner).ofType(EntityType.ENTITY_PORTAL);
    portal.transformComponent.absOrigin = vec3.clone(position);
    portal.transformComponent.absRotation = vec3.fromValues(0, 0, 0);
    portal.transformComponent.absScale = vec3.fromValues(10, 10, 10);
    portal.physicsComponent.aabb = new AABB(portal, 20 ,20, 20);
    portal.meshComponent.setModel(
      assets.getModel("portal")
    );
  }

  tick(dt) {
    this.transformComponent.updateTransform();
    super.tick(dt);
  }
}

EntityType.ENTITY_SPAWNER.construction = (owner) => {
    return new Spawner(
        newID++,
        owner
    );
}
