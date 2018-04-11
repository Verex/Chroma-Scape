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
        this.localplayer = null;
        this.difficulty = 0.0;m
        this.maxdifficulty = 15;
        this.currentState = GameStates.GAMESTATE_SPLASH;
        this.score;

        this.difficultyCurve = (time) => {
            return Math.pow(1.000005, time) - 1;
        }; //Difficulty curve mapping time to difficulty
    }

    updateDifficultyCurve() {
        this.difficulty = this.difficultyCurve(
            GlobalVars.getInstance().curtime
        );
    }
};