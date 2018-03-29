class Portal extends Entity {
    constructor(eid, owner) {
        super(eid, owner, EntityType.ENTITY_PORTAL);

        this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);
        this.componentFactory.construct(ComponentID.COMPONENT_MESH);
        this.componentFactory.construct(ComponentID.COMPONENT_PHYSICS);

        this.physicsComponent = this.getComponent(ComponentID.COMPONENT_PHYSICS);
        this.transformComponent = this.getComponent(ComponentID.COMPONENT_TRANSFORM);
        this.meshComponent = this.getComponent(ComponentID.COMPONENT_MESH);

        this.physicsComponent.collisionType = CollisionType.COLLISION_SOLID;

        var cidx = Math.randInt(0, 3);
        switch(cidx) {
            case 0: this.col = RED; break;
            case 1: this.col = GREEN; break;
            case 2: this.col = BLUE; break;
            case 3: this.col = WHITE; break;
        }

        this.color = this.col.serialize();
    }

    tick(dt) {
        this.physicsComponent.physicsSimulate(dt);
        this.transformComponent.updateTransform();
        super.tick(dt);
    }

    onCollisionOverlap(owner) {

    }
};
EntityType.ENTITY_PORTAL.construction = (owner) => {
    var globals = GlobalVars.getInstance();
    return new Portal(
        newID++,
        owner
    );
}
