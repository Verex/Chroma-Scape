class Dummy extends Entity {
    constructor(eid, owner) {
        super(eid, owner, EntityType.ENTITY_DUMMY);

        // Add components.
        this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);
        this.componentFactory.construct(ComponentID.COMPONENT_MESH);

        this.transformComponent = this.getComponent(ComponentID.COMPONENT_TRANSFORM);
        this.transformComponent.absOrigin = vec3.fromValues(3, 3, -10);
        this.transformComponent.absRotation[Math.Y] += 10;

        this.meshComponent = this.getComponent(ComponentID.COMPONENT_MESH);
    }
    tick(dt) {
        //this.transformComponent.origin[Math.Y] -= 0.01;
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
