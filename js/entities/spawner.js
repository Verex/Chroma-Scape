class Spawner extends Entity {
  constructor(eid, owner) {
    super(eid, owner, EntityType.ENTITY_SPAWNER);

    // Add components.
    this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);

    this.transformComponent = this.getComponent(ComponentID.COMPONENT_TRANSFORM);

    this.nextSpawnTime = 0;
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

  spawnRandomPortal() {
    var x = Math.randInt(-40, 40),
        y = Math.randInt(10, 60);
        
    this.spawnPortal(
      vec3.fromValues(x, y, this.owner.player.transformComponent.absOrigin[Math.Z] - 850)
    );
  }

  getNextSpawn() {
    // Get instance of timer.
    var timer = Timer.getInstance();

    return timer.getCurrentTime() + 5000;
  }

  shouldSpawn() {
    // Get instance of timer.
    var timer = Timer.getInstance();

    // Check if we are past next spawn time.
    if (timer.getCurrentTime() >= this.nextSpawnTime) {
      return true;
    }

    return false;
  }



  tick(dt) {
    // Check if we should spawn a portal.
    if (this.shouldSpawn()) {
      // Spawn a random portal in front of player.
      this.spawnRandomPortal();

      // Set the next portal spawn time.
      this.nextSpawnTime = this.getNextSpawn();
    }

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
