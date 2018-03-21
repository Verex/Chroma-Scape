class TickableComponent extends EntityComponent {
    constructor(owner) {
        super(ComponentID.COMPONENT_TICKABLE, owner);
    }
    
    tick(dt) {
        if(this.onTick) {
            this.onTick(dt);
        }
    }
}