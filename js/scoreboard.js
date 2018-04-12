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
            GlobalVars.getInstance().clientWidth * 0.5,
            GlobalVars.getInstance().clientHeight * 0.2
        );
        this.text = new RenderText(
            "Scoreboard",
            45,
            pos,
            "white",
            this.font
        );
        this.initials = [" ", " ", " "];
        this.initialsIdx = 0;
        this.scoreText = [];
        this.lastID = "";
        this.scoreState = ScoreState.SS_INACTIVE;
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
            'ArrowUp',
            (event) => {
                this.moveCursor(0, -1);
            }
        );

        this.inputComponent.registerEvent(
            InputMethod.INPUT_KEYBOARD,
            InputType.BTN_RELEASE,
            'ArrowDown',
            (event) => {
                this.moveCursor(0, 1);
            }
        );

        this.inputComponent.registerEvent(
            InputMethod.INPUT_KEYBOARD,
            InputType.BTN_RELEASE,
            'ArrowLeft',
            (event) => {
                this.moveCursor(-1, 0);
            }
        );

        this.inputComponent.registerEvent(
            InputMethod.INPUT_KEYBOARD,
            InputType.BTN_RELEASE,
            'ArrowRight',
            (event) => {
                this.moveCursor(1, 0);
            }
        );

        this.inputComponent.registerEvent(
            InputMethod.INPUT_KEYBOARD,
            InputType.BTN_RELEASE,
            'Enter',
            (event) => {
                if(this.scoreState == ScoreState.SS_KEYBOARD) {
                    this.initials[this.initialsIdx++] = this.selectCharacter();
                    if(this.initialsIdx == 3) {
                        var initial = "";
                        this.initials.forEach((value) => {initial += value;});
                        this.postScore(initial, Math.round(this.score));
                        this.scores = this.getScores();
                        this.scoreState = ScoreState.SS_SCOREBOARD;
                    }
                } else if(this.scoreState == ScoreState.SS_SCOREBOARD) {
                    Timer.getInstance().createRelativeTimer("SCORECLOSE", 1000, () => {
                        this.state = SplashState.SPLASH_FADEOUT;
                    }, this, null, false);
                }
            }
        );

        this.blink = true;
        this.blinkTimer = Timer.getInstance().createRelativeTimer("CURSORBLINK", 250, () => {
            this.blink = !this.blink;
        }, this, null, true);
        console.log(this.blinkTimer);
    }

    moveCursor(xDir, yDir) {
        this.cursor[Math.X] += xDir;
        this.cursor[Math.Y] += yDir;
        console.log(this.cursor);
        if(this.cursor[Math.X] > this.keyboardMatrix[this.cursor[Math.Y]].length - 1) {
            this.cursor[Math.X] = 0;
        } if(this.cursor[Math.X] < 0) {
            this.cursor[Math.X] = this.keyboardMatrix[this.cursor[Math.Y]].length - 1;
        }

        if(this.cursor[Math.Y] > this.keyboardMatrix.length - 1) {
            this.cursor[Math.Y] = 0;
        } if(this.cursor[Math.Y] < 0) {
            this.cursor[Math.Y] = this.keyboardMatrix.length - 1;
        }

        console.log(this.cursor);

    }
    selectCharacter() {
        return this.keyboardMatrix[this.cursor[Math.Y]][this.cursor[Math.X]];
    }
    displayOnScreenKeyboard() {
        if(this.blinkTimer.paused) this.blinkTimer.resume();
        this.clearDisplay();
        var w = GlobalVars.getInstance().clientWidth;
        var h = GlobalVars.getInstance().clientHeight;
        new RenderText("New highscore:" + Math.round(this.score) + "!", 45, vec2.fromValues(w * 0.5, h * 0.1), "white", this.font).render(this.ctx);
        for(var i = 0; i < 3; i++) {
            var base = vec2.fromValues(
                w * 0.45,
                h * 0.35
            );
            var text = new RenderText(
                this.initials[i],
                80,
                vec2.fromValues(
                    base[Math.X] + (i * 85),
                    base[Math.Y]
                ),
                "white",
                this.font
            );
            text.render(this.ctx);
            text = new RenderText(
                "_",
                80,
                vec2.fromValues(
                    base[Math.X] + (i * 85),
                    base[Math.Y] + 5
                ),
                "white",
                this.font
            );
            text.render(this.ctx);
        }
        for(var i = 0; i < this.keyboardMatrix.length; i++) {
            var base = vec2.fromValues(
                w * 0.35,
                (i * 100) + h * 0.45
            );
            var counter = 0;
            for(var key in this.keyboardMatrix[i]) {
                var letter = this.keyboardMatrix[i][key];
                var color = (this.cursor[Math.Y] == i && this.cursor[Math.X] == counter) ? "yellow" : "white";
                color = (this.blink) ? color : "white";
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
                    GlobalVars.getInstance().clientWidth * 0.5,
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
        switch(this.scoreState) {
            case ScoreState.SS_KEYBOARD: this.displayOnScreenKeyboard(); break;
            case ScoreState.SS_DISPLAY: this.displayScore(); break;
            case ScoreState.SS_SCOREBOARD: this.displayScoreboard(); break;
            default: break;
        }
    }

    onResize(nw, nh) {
        var pos = vec2.fromValues(
            nw * 0.5,
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
      var x = Math.round(this.inputComponent.gpAxis(0)),
          y = Math.round(this.inputComponent.gpAxis(1));

      this.moveCursor(x, y);
      console.log(x, y);
    }

    processScores(score) {
        if(this.scoreState == ScoreState.SS_INACTIVE) {
            this.scoreState = ScoreState.SS_SCOREBOARD;
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
        console.log("getting");
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
      console.log("posting");
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
