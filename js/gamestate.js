class Gamestate extends Entity {
    constructor(eid, owner) {
        super(eid, owner, EntityType.ENTITY_GAMESTATE);
        this.difficulty = 7.5;
        this.maxdifficulty = 15.0;
    }
    get difficultyFraction() {
        return this.difficulty / this.maxdifficulty;
    }
    awake() {
        this.player = this.findEntity("Player");
    }
};

EntityType.ENTITY_GAMESTATE.construction = (owner) => {
    return new Gamestate(
        newID++,
        owner
);
}