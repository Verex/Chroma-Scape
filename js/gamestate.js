var GameStates = {
    GAMESTATE_MENU: 0,
    GAMESTATE_MENUPAN: 1,
    GAMESTATE_GAME: 2,
    GAMESTATE_GAMEOVER: 3
}
class Gamestate {
    constructor() {
        this.localplayer = null;
        this.difficulty = 0.0;
        this.maxdifficulty = 15;
        this.currentState = GameStates.GAMESTATE_MENU;

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