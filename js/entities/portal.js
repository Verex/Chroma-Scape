class Portal extends Entity {
    constructor(eid, owner) {
        super(eid, owner, EntityType.ENTITY_PORTAL);

        this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);
        this.componentFactory.construct(ComponentID.COMPONENT_MESH);
        this.componentFactory.construct(ComponentID.COMPONENT_PHYSICS);

        this.physicsComponent = this.getComponent(ComponentID.COMPONENT_PHYSICS);
        this.transformComponent = this.getComponent(ComponentID.COMPONENT_TRANSFORM);
        this.meshComponent = this.getComponent(ComponentID.COMPONENT_MESH);
    }

    tick(dt) {
        this.transformComponent.updateTransform();
        super.tick(dt);
    }
};
EntityType.ENTITY_PORTAL.construction = (owner) => {
    var globals = GlobalVars.getInstance();
    return new Portal(
        newID++,
        owner
    );
}
