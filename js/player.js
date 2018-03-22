class Player extends Entity {
    constructor(width, height, eid, owner) {
        super(eid, owner, EntityType.ENTITY_PLAYER);

        // Add components.
        this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);
        this.componentFactory.construct(ComponentID.COMPONENT_INPUT);
        this.componentFactory.construct(ComponentID.COMPONENT_PHYSICS);

        this.transformComponent = this.getComponent(ComponentID.COMPONENT_TRANSFORM);
        this.inputComponent = this.getComponent(ComponentID.COMPONENT_INPUT);
        this.physicsComponent = this.getComponent(ComponentID.COMPONENT_PHYSICS);

        this.inputComponent.registerEvent(
          InputMethod.INPUT_KEYBOARD,
          InputType.BTN_PRESS,
          'KeyW',
          (event) => {
            this.children[0].transformComponent.absOrigin[Math.Z] -= 0.1;
          }
        );

        this.inputComponent.registerEvent(
          InputMethod.INPUT_KEYBOARD,
          InputType.BTN_PRESS,
          'KeyA',
          (event) => {
            this.children[0].transformComponent.absOrigin[Math.X] -= 0.1;
          }
        );

        this.inputComponent.registerEvent(
          InputMethod.INPUT_KEYBOARD,
          InputType.BTN_PRESS,
          'KeyS',
          (event) => {
            this.children[0].transformComponent.absOrigin[Math.Z] += 0.1;
          }
        );

        this.inputComponent.registerEvent(
          InputMethod.INPUT_KEYBOARD,
          InputType.BTN_PRESS,
          'KeyD',
          (event) => {
            this.children[0].transformComponent.absOrigin[Math.X] += 0.1;
          }
        );
    }
    tick(dt) {
        //this.transformComponent.origin[Math.X] -= 0.01;
        this.physicsComponent.physicsSimulate(dt);
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
