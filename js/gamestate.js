class Gamestate {
    constructor() {
        this.localplayer = null;
        this.difficulty = 0.0;

        this.difficultyCurve = (time) => {}; //Difficulty curve mapping time to difficulty
    }
};