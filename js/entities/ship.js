class Ship extends Entity {
    constructor(width, height, eid, owner) {
        super(eid, owner, EntityType.ENTITY_SHIP);

        // Add components.
        this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);
        this.componentFactory.construct(ComponentID.COMPONENT_MESH);
        this.componentFactory.construct(ComponentID.COMPONENT_PHYSICS);

        this.transformComponent = this.getComponent(ComponentID.COMPONENT_TRANSFORM);
        this.physicsComponent = this.getComponent(ComponentID.COMPONENT_PHYSICS);

        this.meshComponent = this.getComponent(ComponentID.COMPONENT_TRANSFORM);
    }
    tick(dt) {
        //this.transformComponent.origin[Math.Y] -= 0.01;
        //this.meshComponent.absRotation[Math.Y] += 1;
        this.physicsComponent.physicsSimulate(dt);
        this.transformComponent.updateTransform();
        super.tick(dt);
    }
};

EntityType.ENTITY_SHIP.construction = (owner) => {
    var globals = GlobalVars.getInstance();
    return new Ship(
        globals.clientWidth,
        globals.clientHeight,
        newID++,
        owner
    );
}
