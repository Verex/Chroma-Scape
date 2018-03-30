class Spawner extends Entity {
  constructor(eid, owner) {
    super(eid, owner, EntityType.ENTITY_SPAWNER);

    // Add components.
    this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);

    this.transformComponent = this.getComponent(ComponentID.COMPONENT_TRANSFORM);
  }

  spawnPortal(position) {
    var assets = Assets.getInstance();
    var portal = new Entity.Factory(this.owner).ofType(EntityType.ENTITY_PORTAL);
    portal.transformComponent.absOrigin = vec3.clone(position);
    portal.transformComponent.absRotation = vec3.fromValues(0, 90, 0);
    portal.transformComponent.absScale = vec3.fromValues(5, 5, 5);
    portal.physicsComponent.aabb = new AABB(portal, 10 ,10, 10);
    portal.meshComponent.setModel(
      assets.getModel("portal")
    );
    portal.meshComponent.model.color = TestMesh().color(portal.color);
    portal.meshComponent.model.reload();
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
