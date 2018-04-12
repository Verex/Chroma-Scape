class AudioComponent extends EntityComponent {
    constructor(owner) {
        super(ComponentID.COMPONENT_AUDIO, owner);

        this.sound = null;
        this.offset = vec3.fromValues(0, 0, 0);
        this.sID = -1;
    }

    playSound(sprite) {
        console.log(this.sound);
        if(sprite !== undefined) {
            this.sID = this.sound.play(sprite);
        } else {
            this.sID = this.sound.play();
        }
    }

    updateSoundPos() {
        var transformComponent = this.owner.getComponent(ComponentID.COMPONENT_TRANSFORM);
        var worldTranslation = transformComponent.getWorldTranslation();   
        this.sound.pos(worldTranslation[Math.X], worldTranslation[Math.Y], worldTranslation[Math.Z], this.sID);
    }

    playSpatial(sprite) {
        if(!this.owner || !this.owner.hasComponent(ComponentID.COMPONENT_TRANSFORM)) return;
        var transformComponent = this.owner.getComponent(ComponentID.COMPONENT_TRANSFORM);
        var worldTranslation = transformComponent.getWorldTranslation();
        var worldOrientation = transformComponent.getWorldRotation();

        this.playSound(sprite);
        if(this.sID == -1) {
            console.error("FAILED TO PLAY SOUND!!!");
            return;
        }
        this.sound.pos(worldTranslation[Math.X], worldTranslation[Math.Y], worldTranslation[Math.Z], this.sID);
    }

    setVolume(volume) {
        if(this.sID == -1) return;
        this.sound.volume(volume, this.sID);
    }
};