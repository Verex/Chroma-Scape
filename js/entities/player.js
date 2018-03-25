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

        this.physicsComponent.velocity[Math.X] = 0;

        this.transformComponent.absOrigin[Math.Y] = 10;
        this.cursorPosition = vec2.fromValues(-1, -1);

        /*
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
          'KeyD',
          (event) => {
            this.children[0].transformComponent.absOrigin[Math.X] += 0.1;
          }
        );
        
        */

        this.inputComponent.registerEvent(
            InputMethod.INPUT_MOUSE,
            InputType.MSE_MOVE,
            null,
            (event) => { this.onMouseMove(event); }
        )
    }
    onMouseMove(event) {
        this.cursorPosition = vec2.fromValues(
            event.offsetX,
            event.offsetY
        );
    }
    swayShip() {
        var globals = GlobalVars.getInstance();
        var x = 2 * this.cursorPosition[Math.X] / globals.clientWidth - 1;
        var y = 1 - (2 * this.cursorPosition[Math.Y] / globals.clientHeight);
        var pos = vec3.fromValues(x, y, 0);
        vec3.transformMat4(
            pos,
            pos,
            this.camera.getInvViewProjectionMatrix()
        );        
    }
    tick(dt) {
        if(this.cursorPosition[0] !== -1 && this.cursorPosition[1] !== -1) {
            this.swayShip();
        }
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
