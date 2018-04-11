var GameStates = {
    GAMESTATE_SPLASH: 0,
    GAMESTATE_MENU: 1,
    GAMESTATE_MENUPAN: 2,
    GAMESTATE_GAME: 3,
    GAMESTATE_GAMEOVER: 4,
    GAMESTATE_HISCORE: 5,
    GAMESTATE_NEWGAME: 6
}
class Gamestate {
    constructor() {
        this.localplayer = null; //May not be neccesary 
        this.difficulty = 0.0;
        this.maxdifficulty = 15;
        this._currentState = GameStates.GAMESTATE_SPLASH;
        this.scoreMultiplier = 1.0; // This is an instantaneous score multiplier, it only applies to the increment of the score at any given time
        this.score = 0;
        this.lastZ = 0;
        this.diffToScore = 1.0;

        this.onGamestateChanged = [];
        //TODO(Jake): This needs to start accounting for the time elapsed since THE GAME STARTED!!!
        this.difficultyCurve = (time) => {
            return Math.pow(1.000005, time) - 1;
        }; //Difficulty curve mapping time to difficulty
    }
    set currentState(state) {
        //Call our ongamestatechanged cb and then update our gamestate
        for(var i = 0; i < this.onGamestateChanged.length; i++) {
            var cb = this.onGamestateChanged[i];
            cb.cb.call(cb.owner, this._currentState, state);
        }
        this._currentState = state;
    }

    get currentState() {
        return this._currentState;
    }

    updateDifficultyCurve() {
        this.difficulty = this.difficultyCurve(
            GlobalVars.getInstance().curtime
        );
    }

/*
        Score calculation
        dist = (curentZ > lastZ) ? (currentZ - lastZ) : (currentZ == lastZ) ? 0 : (1000 - lastZ + currentZ)
        Score  = score + ((dist * scoreMultiplier) * (difficulty) / diffToScore)
    */
    updateScore(dt) {
        if(this.localplayer === null) {
            console.log(this.localplayer);
            this.score = 0;
            return;
        }
        if(this.currentState !== GameStates.GAMESTATE_GAME) return;
        this.score += (dt * this.scoreMultiplier) * ((this.difficulty > 1) ? this.difficulty : 1.0 / this.diffToScore);
    }
};