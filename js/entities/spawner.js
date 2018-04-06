class Spawner extends Entity {
  constructor(eid, owner) {
    super(eid, owner, EntityType.ENTITY_SPAWNER);

    // Add components.
    this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);

    this.transformComponent = this.getComponent(ComponentID.COMPONENT_TRANSFORM);

    this.nextSpawnTime = 0;
    this.lastPortal = vec3.fromValues(0, 30, -150);
  }

  spawnPortal(position) {
    var assets = Assets.getInstance();
    var portal = new Entity.Factory(this.owner).ofType(EntityType.ENTITY_PORTAL);
    portal.transformComponent.absOrigin = vec3.clone(position);
    portal.transformComponent.absRotation = vec3.fromValues(0, 0, 0);
    portal.transformComponent.absScale = vec3.fromValues(10, 10, 4);
    portal.physicsComponent.aabb = new AABB(portal, 20 ,20, 10);
    portal.meshComponent.setModel(
      assets.getModel("portal")
    );
  }

  spawnRandomPortal() {
    var position = vec3.fromValues(
      Math.min(Math.max(this.lastPortal[Math.X] + Math.randInt(-20, 20), -40), 40),
      Math.min(Math.max(this.lastPortal[Math.Y] + Math.randInt(-20, 20), 20), 60),
      this.lastPortal[Math.Z] - Math.randInt(200, 700)
    );
    console.log("Spawned portal at: " + position);
    this.lastPortal = position;
    this.spawnPortal(position);
  }

  getNextSpawn() {
    // Get instance of timer.
    var timer = Timer.getInstance();

    return timer.getCurrentTime() + 2000;
  }

  shouldSpawn() {
    // Get current time.
    var time = Timer.getInstance().getCurrentTime();

    // Check if we are past next spawn time.
    if (time >= this.nextSpawnTime && !this.owner.player.hasCrashed) {
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
