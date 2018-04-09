class Spawner extends Entity {
  constructor(eid, owner) {
    super(eid, owner, EntityType.ENTITY_SPAWNER);

    // Add components.
    this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);

    this.transformComponent = this.getComponent(ComponentID.COMPONENT_TRANSFORM);

    this.nextSpawnTime = 0;
    this.lastPortal = vec3.fromValues(0, 30, -150);
    this.enabled = false;
  }

  spawn(entityType, position) {
    // Create entity as child of game world.
    var entity = new Entity.Factory(this.owner).ofType(entityType);

    // Assign position of entity.
    entity.transformComponent.absOrigin = vec3.clone(position);

    switch (entityType) {
      case EntityType.ENTITY_PORTAL:
        entity.transformComponent.absScale = vec3.fromValues(10, 10, 4);
        entity.physicsComponent.aabb = new AABB(entity, 20 ,20, 10);
        break;
      case EntityType.ENTITY_PILLAR:
        entity.transformComponent.absScale = vec3.fromValues(10, 5, 10);
        entity.physicsComponent.aabb = new AABB(entity, 20, 40, 20);
        break;
    }
  }

  spawnRandomPortal() {
    var position = vec3.fromValues(
      Math.min(Math.max(this.lastPortal[Math.X] + Math.randInt(-20, 20), -40), 40),
      Math.min(Math.max(this.lastPortal[Math.Y] + Math.randInt(-20, 20), 20), 60),
      this.lastPortal[Math.Z] - Math.randInt(250, 700)
    );
    this.lastPortal = position;
    this.spawn(EntityType.ENTITY_PORTAL, position);
  }

  spawnPillarSet() {
    var position = vec3.fromValues(
      Math.min(Math.max(this.lastPortal[Math.X] + Math.randInt(-20, 20), -40), 40),
      20,
      this.lastPortal[Math.Z] - Math.randInt(200, 700)
    );
    this.lastPortal = position;
    this.spawn(EntityType.ENTITY_PILLAR, position);
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
    if(!this.enabled) {
      this.nextSpawnTime = this.getNextSpawn();
    } else if (this.shouldSpawn()) {
      // Spawn a random portal in front of player.
      //this.spawnRandomPortal();
      this.spawnPillarSet();

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
