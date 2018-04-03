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
            src: ['./assets/sounds/sprite.webm', './assets/sounds/sprite.mp3'],
            sprite: {
              lightning: [2000, 4147],
              rain: [8000, 9962, true],
              thunder: [19000, 13858],
              music: [34000, 31994, true]
            },
            volume: 0
        });

        
        this.audioComponent.playSpatial('music');
        this.audioComponent.sound.once('play', () => {
            this.audioComponent.sound.pannerAttr({
                panningModel: 'HRTF',
                refDistance: 0.8,
                rolloffFactor: 0.35,
                distanceModel: 'exponential'
              }, this.audioComponent.sID);
        });
        this.audioComponent.setVolume(0.0);
    }

}

EntityType.ENTITY_SPEAKER.construction = (owner) => {
    return new Speaker(
        newID++,
        owner
    );
}
