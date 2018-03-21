class GameWorld extends Entity {
    constructor() {
        super(newID++, undefined, EntityType.ENTITY_GAMEWORLD);
        this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);

        //HACK HACK(Jake): I couldn't really think of a place to put this so for now our game world will hold our scene
        //and our renderer will be responsible for processing the gameworld and rendering it's scene
        this.scene = new Scene(); 
        this.sceneNode = new SceneNode(this);
        this.scene.rootNode = this.sceneNode;
    }

    onEntityCreated(newEnt) {
        switch(newEnt.type) {
            case EntityType.ENTITY_CAMERA: //We need to add our camera to our scene
                this.scene.cameras.push(newEnt);
                break;
            default: break;
        }
        newEnt.sceneNode = new SceneNode(newEnt);
        if(newEnt.owner) {
            newEnt.sceneNode.attachTo(newEnt.owner.sceneNode);
        }
    }

    tick(dt) {
        super.tick(dt);
    }

    updateSceneGraph() {
        this.sceneNode.update();
    }
};
EntityType.ENTITY_GAMEWORLD.construction = () => {
    if(newID != 0) {
        console.error("Game world not root!");
        return null;
    }
    return new GameWorld();
}