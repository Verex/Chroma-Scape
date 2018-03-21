class Player extends Entity {
    constructor(width, height, eid, owner) {
        super(eid, owner, EntityType.ENTITY_PLAYER);

        // Add components.
        this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);

        this.transformComponent = this.getComponent(ComponentID.COMPONENT_TRANSFORM);
    }
    tick(dt) {
        this.transformComponent.origin[Math.Y] += 0.01;
        this.transformComponent.updateTransform();
        super.tick(dt);
    }
};

EntityType.ENTITY_PLAYER.construction = (owner) => {
    var globals = GlobalVars.getInstance();
    return new Player(
        globals.clientWidth,
        globals.clientHeight,
        newID++,
        owner
    );
}
