class Dummy extends Entity {
    constructor(eid, owner) {
        super(eid, owner, EntityType.ENTITY_DUMMY);

        // Add components.
        this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);
        this.componentFactory.construct(ComponentID.COMPONENT_MESH);

        this.transformComponent = this.getComponent(ComponentID.COMPONENT_TRANSFORM);        
        this.meshComponent = this.getComponent(ComponentID.COMPONENT_MESH);
    }
    tick(dt) {
        this.transformComponent.updateTransform();
        super.tick(dt);
    }
};

EntityType.ENTITY_DUMMY.construction = (owner) => {
    var globals = GlobalVars.getInstance();
    return new Dummy(
        newID++,
        owner
    );
}
