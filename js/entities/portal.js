class Portal extends Entity {
    constructor(eid, owner) {
        super(eid, owner, EntityType.ENTITY_PORTAL);

        this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);
        this.componentFactory.construct(ComponentID.COMPONENT_MESH);
        this.componentFactory.construct(ComponentID.COMPONENT_PHYSICS);

        this.physicsComponent = this.getComponent(ComponentID.COMPONENT_PHYSICS);
        this.transformComponent = this.getComponent(ComponentID.COMPONENT_TRANSFORM);
        this.meshComponent = this.getComponent(ComponentID.COMPONENT_MESH);

        var cidx = Math.randInt(0, 3);
        switch(cidx) {
            case 0: this.color = RED.serialize(); break;
            case 1: this.color = GREEN.serialize(); break;
            case 2: this.color = BLUE.serialize(); break;
            case 3: this.color = WHITE.serialize(); break;
        }
    }

    tick(dt) {
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
