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

    var z = 0;

    if (!this.firstPortal) {
      z = this.getGameWorld().player.transformComponent.absOrigin[Math.Z] - 200;
    } else {
      z = Math.min(
        this.lastPortal[Math.Z] - Math.randInt(800 - (700 * difficulty), 1500 - (1200 * difficulty)),
        this.getGameWorld().player.transformComponent.absOrigin[Math.Z] - 200
      );
    }

    var position = vec3.fromValues(Math.randInt(-40, 40), Math.randInt(20, 60), z);

    this.history.portals.push(position);

    // Spawn portal.
    var portal = this.spawn(EntityType.ENTITY_PORTAL, position);
    portal.speaker = new Entity.Factory(portal).ofType(EntityType.ENTITY_SPEAKER);
    portal.speaker.falloff = true;
    portal.speaker.setSound("effects", "portal");
    // Create wall entity.
    portal.wall = this.spawn(EntityType.ENTITY_WALL, position);
    portal.wall.spawnTime = time;

    if (!this.firstPortal) {
      portal.wall.enable();
      this.firstPortal = true;
    }
  }

  spawnPillarSet() {
    var time = Timer.getInstance().getCurrentTime(),
        difficulty = (this.getGameWorld().gamestate.difficulty/this.getGameWorld().gamestate.maxdifficulty);

    var tot = 0;
    for (var r = 0; r < 10; r++) {
      var r1 = Math.floor(10 * difficulty), r2 = Math.floor(20 * difficulty),
          count = Math.randInt(0 + r1, 6 + r2);

      var zStart = this.lastPortal[Math.Z] + (150 * r);

      if (this.history.portals.length > 1) {
        var maxZ = this.history.portals[this.history.portals.length - 2][Math.Z];
        if (Math.abs((zStart + 100) - maxZ) < 100) {
          break;
        }
      }

      for (var c = 0; c < count; c++) {
        var near = false,
            position = vec3.create();

        do {
          near = false;
          position = vec3.fromValues(
            Math.randInt(-400, 400),
            40.5,
            zStart + Math.randInt(-150, 150)
          );

          // Check if too close to portal spawn.
          for (var m = 1; m < 10; m++) {
            if (this.history.portals.length - m < 0) continue;
            var p = this.history.portals[this.history.portals.length - m];

            if (vec3.dist(position, p) < 75 ||
              Math.abs(position[Math.Z] - p[Math.Z]) < 30) {
              near = true;
              break;
            }
          }

          var distance = 25 + 100 * (1 - difficulty);
          for (var m = 1; m < tot; m++) {
            if (this.history.pillars.length - m < 0) continue;
            var p = this.history.pillars[this.history.pillars.length - m];

            if (vec3.dist(position, p) < distance) {
              near = true;
              break;
            }
          }

        } while (near);

        this.history.pillars.push(position);

        var pillar = this.spawn(EntityType.ENTITY_PILLAR, position);
        pillar.spawnTime = time - (Math.randInt(100, 1200));
        pillar.transformComponent.absScale = vec3.fromValues(5, 10, 5);
        pillar.physicsComponent.aabb = new AABB(pillar, 10, 80, 10);
        tot += 1;
      }
    }
  }

  getNextSpawn() {
    // Get instance of timer.
    var time = Timer.getInstance().getCurrentTime(),
        difficulty = (this.getGameWorld().gamestate.difficulty/this.getGameWorld().gamestate.maxdifficulty);

    return time + (this.firstPortal ? 4000 - (3700 * difficulty) : 0);
  }

  shouldSpawn() {
    // Get current time.
    var time = Timer.getInstance().getCurrentTime(),
        player = this.owner.player;

    // Check if we are past next spawn time.
    if (time >= this.nextSpawnTime && !player.hasCrashed) {
      if (Math.abs(player.transformComponent.absOrigin[Math.Z] - this.lastPortal[Math.Z]) > 5000) {
        this.nextSpawnTime = this.getNextSpawn();
        return false;
      }
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
