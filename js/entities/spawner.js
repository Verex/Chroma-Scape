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

    // Define pillar reuse array.
    this.recycledPillars = [];

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
    // Get current time and difficulty values.
    var time = Timer.getInstance().getCurrentTime(),
      difficulty = (this.getGameWorld().gamestate.difficulty / this.getGameWorld().gamestate.maxdifficulty);

    var z = 0;

    if (!this.firstPortal) {
      z = this.getGameWorld().player.transformComponent.absOrigin[Math.Z] - 2200;
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

    // Create wall entity.
    portal.wall = this.spawn(EntityType.ENTITY_WALL, position);
    portal.wall.spawnTime = time;

    if (!this.firstPortal) {
      portal.wall.enable();
      this.firstPortal = true;
    }
  }

  spawnPillarSet() {
    // Get current time and difficulty values.
    var time = Timer.getInstance().getCurrentTime(),
      difficulty = (this.getGameWorld().gamestate.difficulty / this.getGameWorld().gamestate.maxdifficulty);

    var tot = 0;

    var zStart = (Math.ceil(this.lastPortal[Math.Z] / 10) * 10),
        prePortal = this.history.portals[this.history.portals.length - 2],
        zEnd = zStart + 700;

    if (prePortal != null) {
      zEnd = (Math.floor(prePortal[Math.Z] / 10) * 10);
    }

    var rowCount = Math.floor((zEnd - zStart) / 10) - 5;
    console.log("Start: ", zStart, " End: ", zEnd, " - ", rowCount );

    var maxRowChance = 12 - (Math.floor(6 * difficulty));

    for (var r = 0; r < rowCount; r++) {
      if (Math.randomRange(0, maxRowChance) > 1) {
        continue;
      }

      var maxPillarChance = 25 - (Math.floor(10 * difficulty)),
          pillarZ = zStart + (r * 10) + 5;

      for (var c = -18; c < 18; c++) {
        if (Math.randomRange(0, maxPillarChance) > 1) {
          continue;
        }

        var position = vec3.fromValues(
          (c * 10) + 5,
          40.1,
          pillarZ
        );

        var pillar = null;

        // Check if we can recycle any pillars.
        if (this.recycledPillars.length > 0) {

          // Get first pillar.
          pillar = this.recycledPillars.shift();

          // Assign position of reused pillar.
          pillar.transformComponent.absOrigin = vec3.clone(position);

          // Pillar is done being recycled.
          pillar.recycled = false;
        } else {
          // Spawn new pillar.
          pillar = this.spawn(EntityType.ENTITY_PILLAR, position);

          // Scale new pillar.
          pillar.transformComponent.absScale = vec3.fromValues(5, 10, 5);

          // Create new AABB.
          pillar.physicsComponent.aabb = new AABB(pillar, 10, 80, 10);
        }

        // Push pillar's position into history.
        pillar.posHistoryID = this.history.pillars.push(position);

        // Assign spawn time for pillar.
        pillar.spawnTime = time - (Math.randInt(100, 1200));

        tot += 1;
      }
    }

    console.log("Total pillars: ", tot);
  }

  getNextSpawn() {
    // Get instance of timer.
    var time = Timer.getInstance().getCurrentTime(),
      difficulty = (this.getGameWorld().gamestate.difficulty / this.getGameWorld().gamestate.maxdifficulty);

    return time + (this.firstPortal ? 1000 : 0);
  }

  shouldSpawn() {
    // Get current time.
    var time = Timer.getInstance().getCurrentTime(),
      player = this.owner.player;

    // Return true if we have passed the alloted spawn time.
    if (this.nextSpawnTime < time && !player.hasCrashed 
      && Math.abs(player.transformComponent.absOrigin[Math.Z] - this.lastPortal[Math.Z]) < 7000) {
      return true;
    }

    return false;
  }

  tick(dt) {
    // Check if we should spawn a portal.
    if (!this.enabled) {
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
