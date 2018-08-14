class Pillar extends Entity {
    constructor(eid, owner) {
        super(eid, owner, EntityType.ENTITY_PILLAR);

        // Add entity components.
        this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);
        this.componentFactory.construct(ComponentID.COMPONENT_MESH);
        this.componentFactory.construct(ComponentID.COMPONENT_PHYSICS);

        this.physicsComponent = this.getComponent(ComponentID.COMPONENT_PHYSICS);
        this.transformComponent = this.getComponent(ComponentID.COMPONENT_TRANSFORM);
        this.meshComponent = this.getComponent(ComponentID.COMPONENT_MESH);

        // Define entity's collision type.
        this.physicsComponent.collisionType = CollisionType.COLLISION_SOLID;

        // True if pillar is being recycled.
        this.recycled = false;

        this.posHistoryID = 0;

        // Assign mesh.
        var assets = Assets.getInstance();
        this.meshComponent.setModel(
            assets.getModel("pillar")
        );

        this.meshComponent.setMaterial(
            assets.getMaterial("Pillar")
        );
    }
    setupMaterial(gl) {
        var cTime = Timer.getInstance().getCurrentTime() - this.spawnTime,
            red = (Math.sin(cTime / 500) * 0.5 + 0.5);
        var program = this.meshComponent.material.renderPrograms[0];

        gl.uniform4f(
            program.uniformLocation("u_BeaconColor"),
            red,
            0.0,
            0.0,
            1.0
        );
    }
    checkForMiss() {
        var position = this.transformComponent.absOrigin,
            playerPosition = this.owner.player.transformComponent.absOrigin;

        // Check if behind player, then store for reuse.
        if (position[Math.Z] - 50 > playerPosition[Math.Z]) {

            // Push object for reuse.
            this.owner.spawner.recycledPillars.push(this);

            // Remove pillar's position from history.
            this.owner.spawner.history.pillars.splice(this.posHistoryID, 1);

            // Move portal to some awkward location far, far, away...
            this.transformComponent.absOrigin = vec3.fromValues(-5000, 0, -5000);

            // Pillar is ready to be recycled.
            this.recycled = true;

            //this.destroy();
        }
    }

    tick(dt) {
        // Only update if we're not in process of being recycled.
        if (!this.recycled) {
            this.checkForMiss();
        }

        this.physicsComponent.physicsSimulate(dt);
        this.transformComponent.updateTransform();

        super.tick(dt);
    }

};
EntityType.ENTITY_PILLAR.construction = (owner) => {
    return new Pillar(
        newID++,
        owner
    );
}
