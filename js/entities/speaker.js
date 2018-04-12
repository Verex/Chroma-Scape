class Speaker extends Entity {
    constructor(eid, owner) {
        super(eid, owner, EntityType.ENTITY_SPEAKER);

        // Add entity components.
        this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);
        this.componentFactory.construct(ComponentID.COMPONENT_AUDIO);

        this.transformComponent = this.getComponent(ComponentID.COMPONENT_TRANSFORM);
        this.audioComponent = this.getComponent(ComponentID.COMPONENT_AUDIO);

        this.componentFactory.construct(ComponentID.COMPONENT_MESH);
        this.meshComponent = this.getComponent(ComponentID.COMPONENT_MESH);


        this.audioComponent.sound = new Howl({
            src: ['./assets/sounds/sprites/effects.mp3'],
            sprite: {
              portal: [0, 6852, true],
              pass1: [6852, 7758],
              pass2: [7758, 8626],
              pass3: [8626, 9507]
            },
            volume: 0
        });


        this.audioComponent.playSpatial('portal');
        this.audioComponent.sound.once('play', () => {
            this.audioComponent.sound.pannerAttr({
                panningModel: 'HRTF',
                refDistance: 0.8,
                rolloffFactor: 0.35,
                distanceModel: 'exponential'
              }, this.audioComponent.sID);
        });
        this.audioComponent.setVolume(1.0);
    }

}

EntityType.ENTITY_SPEAKER.construction = (owner) => {
    return new Speaker(
        newID++,
        owner
    );
}
