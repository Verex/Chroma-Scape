class GameWorld extends Entity {
    constructor() {
        super(newID++, undefined, EntityType.ENTITY_GAMEWORLD);
        this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);
        this.componentFactory.construct(ComponentID.COMPONENT_TICKABLE);

        this.components[ComponentID.COMPONENT_TICKABLE].onTick = this.tick;

        //HACK HACK(Jake): I couldn't really think of a place to put this so for now our game world will hold our scene
        //and our renderer will be responsible for processing the gameworld and rendering it's scene
        this.scene = new Scene(); 
    }

    onEntityCreated(newEnt) {
        switch(newEnt.type) {
            case EntityType.ENTITY_CAMERA: //We need to add our camera to our scene
                this.scene.cameras.push(newEnt);
                break;
            default: break;
        }

        //This entity has some sort of component mesh and needs to be included in the scene graph
        if(newEnt.hasComponent(ComponentID.COMPONENT_MESH)) { 

        }
    }

    tick(dt) {
        console.log(dt);
    }
};
EntityType.ENTITY_GAMEWORLD.construction = () => {
    if(newID != 0) {
        console.error("Game world not root!");
        return null;
    }
    return new GameWorld();
}