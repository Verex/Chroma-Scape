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

        this.meshComponent.setModel(
            Assets.getInstance().getModel("test")
        );
        this.transformComponent.absScale = vec3.fromValues(50, 50, 50);
        this.falloff = false;
    }

    updateSoundPos() {
        this.audioComponent.updateSoundPos();
    }

    playSound(sound, sprite) {
        this.audioComponent.sound = Assets.getInstance().getSound(sound);
        this.audioComponent.playSound(sprite);
    }

    stop() {
        this.audioComponent.setVolume(0.0);
    }

    setSound(sound, sprite) {
        this.audioComponent.sound = Assets.getInstance().getSound(sound);

        if(this.falloff == true) {
            this.audioComponent.playSpatial(sprite);
            this.audioComponent.sound.once('play', () => {
                this.audioComponent.sound.pannerAttr({
                    panningModel: 'HRTF',
                    refDistance: 15,
                    rolloffFactor: 0.9,
                    distanceModel: 'exponential'
                  }, this.audioComponent.sID);
            });
        } else {
            this.audioComponent.playSound(sprite);
        }
        this.audioComponent.setVolume(1.0);
    }

}

EntityType.ENTITY_SPEAKER.construction = (owner) => {
    return new Speaker(
        newID++,
        owner
    );
}
