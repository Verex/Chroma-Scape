class Spawner extends Entity {
  constructor(eid, owner) {
    super(eid, owner, EntityType.ENTITY_SPAWNER);

    // Add components.
    this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);

    this.transformComponent = this.getComponent(ComponentID.COMPONENT_TRANSFORM);

    this.nextSpawnTime = 0;
    this.enabled = false;

    // Define position history arrays.
    this.history = {
      portals: [],
      pillars: []
    };

    this.firstPortal = false;
  }

  get lastPortal() {
    if (this.history.portals.length > 0) {
      return this.history.portals[this.history.portals.length - 1];
    } else {
      return this.getGameWorld().player.transformComponent.absOrigin;
    }
  }

  spawn(entityType, position) {
    // Create entity as child of game world.
    var entity = new Entity.Factory(this.owner).ofType(entityType);

    // Assign position of entity.
    entity.transformComponent.absOrigin = vec3.clone(position);

    return entity;
  }

  spawnRandomPortal() {
    var time = Timer.getInstance().getCurrentTime(),
        difficulty = (this.getGameWorld().gamestate.difficulty/this.getGameWorld().gamestate.maxdifficulty);

    var position = vec3.fromValues(
      Math.randInt(-40, 40),
      Math.randInt(20, 60),
      this.lastPortal[Math.Z] - Math.randInt(800 - (700 * difficulty), 1500 - (1200 * difficulty))
    );

    this.history.portals.push(position);

    // Spawn portal.
    var portal = this.spawn(EntityType.ENTITY_PORTAL, position);

    // Create wall entity.
    portal.wall = this.spawn(EntityType.ENTITY_WALL, position);
    portal.wall.spawnTime = time;

    if (!this.firstPortal) {
      portal.wall.enable();
      this.firstPortal = true;
    }
  }

  spawnPillarSet() {
    var time = Timer.getInstance().getCurrentTime();

    for (var n = 0; n < 10; n++) {
      var near = false,
          position = vec3.create();
      do {
        position = vec3.fromValues(
          this.lastPortal[Math.X] + Math.randInt(-100, 100),
          40,
          this.lastPortal[Math.Z] + (150 * n)
        );

        // Check all nearby portals.
        for (var m = 1; m < 10; m++) {
          if (this.history.portals.length - m < 0) continue;
          var p = this.history.portals[this.history.portals.length - m];
          if (vec3.dist(position, p) < 50) {
            near = true;
            return;
          }
        }
      } while (near);

      var pillar = this.spawn(EntityType.ENTITY_PILLAR, position);
      pillar.spawnTime = time;
      pillar.transformComponent.absScale = vec3.fromValues(5, 10, 5);
      pillar.physicsComponent.aabb = new AABB(pillar, 10, 80, 10);
    }
  }

  getNextSpawn() {
    // Get instance of timer.
    var timer = Timer.getInstance();

    return timer.getCurrentTime() + 5000;
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
      this.spawnRandomPortal();
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
