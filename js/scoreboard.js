var ScoreState = {
    SS_INACTIVE: 0,
    SS_DISPLAY: 1,
    SS_KEYBOARD: 2,
    SS_SCOREBOARD: 3
}
class Scoreboard extends SplashScreen {
    constructor(ctx, width, height) {
        super(ctx, width, height);

        this.font = Assets.getInstance().getFont("PressStart2P-Regular");
        var pos = vec2.fromValues(
            GlobalVars.getInstance().clientWidth * 0.3,
            GlobalVars.getInstance().clientHeight * 0.2
        );
        this.text = new RenderText(
            "Scoreboard",
            45,
            pos,
            "white", 
            this.font
        );
        this.scoreText = [];
        this.lastID = "";
        this.scoreState = ScoreState.SS_KEYBOARD;
        this.keyboardMatrix = [
            ["Q", "W", "E", "R", "T", "Y", "U", "I", "P"],
            ["A", "S" , "D", "F", "G", "H", "J", "K", "L"],
            ["Z", "X", "C", "V", "B", "N", "M"]
        ]

        this.cursor = vec2.fromValues(0, 0);
        this.components = [];
        var factory = new EntityComponent.ComponentFactory(this).construct(ComponentID.COMPONENT_INPUT);
        this.inputComponent = this.components[ComponentID.COMPONENT_INPUT]; 
        this.inputComponent.registerEvent(
            InputMethod.INPUT_KEYBOARD,
            InputType.BTN_RELEASE,
            'KeyE',
            (event) => {

            }
        );
        this.inputComponent.registerEvent(
            InputMethod.INPUT_KEYBOARD,
            InputType.BTN_RELEASE,
            'KeyE',
            (event) => {
                
            }
        );
        this.inputComponent.registerEvent(
            InputMethod.INPUT_KEYBOARD,
            InputType.BTN_RELEASE,
            'KeyE',
            (event) => {
                
            }
        );
        this.inputComponent.registerEvent(
            InputMethod.INPUT_KEYBOARD,
            InputType.BTN_RELEASE,
            'KeyE',
            (event) => {
                
            }
        );

        this.blink = true;
        this.blinkTimer = Timer.getInstance().createRelativeTimer("CURSORBLINK", 150, () => {
            this.blink = !this.blink;
        }, this, null, true);
        this.blinkTimer.pause(GlobalVars.getInstance().curtime);
    }

    moveCursor(xDir, yDir) {
        this.cursor[Math.X] += xDir;
        if(this.cursor[Math.X] > this.keyboardMatrix[this.cursor[Math.Y]].length) {
            this.cursor[Math.X] = 0;
        } if(this.cursor[Math.X] < 0) {
            this.cursor[Math.X] = this.keyboardMatrix[this.cursor[Math.Y]].length;
        }

        this.cursor[Math.X] += yDir;
        if(this.cursor[Math.Y] > this.keyboardMatrix.length) {
            this.cursor[Math.Y] = 0;
        } if(this.cursor[Math.Y] < 0) {
            this.cursor[Math.X] = this.keyboardMatrix.length;
        }

    }
    selectCharacter() {
        return this.keyboardMatrix[this.cursor[Math.Y]][this.cursor[Math.X]];
    }
    displayOnScreenKeyboard() {
        this.clearDisplay();
        for(var i = 0; i < this.keyboardMatrix.length; i++) {
            var base = vec2.fromValues(
                GlobalVars.getInstance().clientWidth * 0.50,
                (i * 100) + GlobalVars.getInstance().clientHeight * 0.25
            );
            var counter = 0;
            for(var key in this.keyboardMatrix[i]) {
                var letter = this.keyboardMatrix[i][key];
                var color = (this.cursor[Math.X] == i && this.cursor[Math.X] == counter) ? "yellow" : "white";
                console.log(this.cursor[Math.X], this.cursor[Math.X], i, counter);
                console.log(letter, color);
                var text = new RenderText(
                    letter,
                    80,
                    vec2.fromValues(
                        base[Math.X] + (counter++ * 85),
                        base[Math.Y]
                    ),
                    color,
                    this.font
                );
                text.render(this.ctx);
            }
        }
    }

    displayScore() {
        this.clearDisplay();
    }

    clearDisplay() {
        this.ctx.globalAlpha = 1.0;
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, GlobalVars.getInstance().clientWidth, GlobalVars.getInstance().clientHeight);
    }

    displayScoreboard() {
        var scores = this.scores;
        this.clearDisplay();
        this.text.render(this.ctx);
        this.scoreText = [];
        for(var i = 0; i < 10; i++) {
            this.scoreText[i] = new RenderText(
                scores[i].player + "..." + scores[i].score,
                20,
                vec2.fromValues(
                    GlobalVars.getInstance().clientWidth * 0.39,
                    (i * 50) + GlobalVars.getInstance().clientHeight * 0.25
                ), 
                (scores[i].id === this.lastID) ? "yellow" : "white", 
                this.font
            );
            this.scoreText[i].render(this.ctx);
        }
    }
    draw() {
        if(this.state == SplashState.SPLASH_IDLE) {
            if(this.idleTime !== undefined) {
                if(GlobalVars.getInstance().curtime > this.idleTime) {
                    this.state = SplashState.SPLASH_FADEOUT;
                }
            }
        }
        console.log(this.scoreState);
        switch(this.scoreState) {
            case ScoreState.SS_KEYBOARD: this.displayOnScreenKeyboard(); break;
            case ScoreState.SS_DISPLAY: this.displayScore(); break;
            case ScoreState.SS_SCOREBOARD: this.displayScoreboard(); break;
            default: break;
        }
    }

    onResize(nw, nh) {
        var pos = vec2.fromValues(
            nw * 0.3,
            nh * 0.2
        );
        this.text = new RenderText(
            "Scoreboard",
            45,
            pos,
            "white", 
            this.font
        );
    }

    update() {

    }

    processScores(score) {
        if(this.scoreState == ScoreState.SS_INACTIVE) {
            this.score = score;
            this.scores = this.getScores();
            if(this.isHighScore(score)) {
                this.scoreState = ScoreState.SS_KEYBOARD;
            }
        }
    }

    isHighScore(score) {
        for(var i = 0; i < 10; i++) {
            if(score > this.scores[i].score) {
                return true;
            }
        }
        return false;
    }

    getScores() {
        var map = [];
        $.ajax({
            url: "/score",
            type: 'GET',
            dataType: 'json',
            success: (data) => {
                for(var k in data.items) {
                    var player = data.items[k].player;
                    var score = data.items[k].score;
                    map.push(
                        {player: player, score: score, id: data.items[k]._id}
                    );
                }
            }
        });
        map.sort((a, b) => {
            return b.score - a.score
        });
        return map;
    }

    postScore(name, score) {
        var data = {
            player: name,
            score: score,
            scope: "game-expo"
          };
          var id = "";
          $.ajax({
            url: "/score",
            data: JSON.stringify(data),
            dataType: 'json',
            type: 'POST',
            crossDomain: true,
            success: (data) => {
                id = data._id;
            }
          });
          this.lastID = id;
    }
};