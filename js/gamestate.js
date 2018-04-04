var GameScreens = {
    GAMESCREEN_MENU: 0,
    GAMESCREEN_GAME: 1,
    GAMESCREEN_GAMEOVER: 2
}
class Gamestate {
    constructor() {
        this.localplayer = null;
        this.difficulty = 0.0;
        this.maxdifficulty = 15;
        this.currentScreen = GameScreens.GAMESCREEN_MENU;

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