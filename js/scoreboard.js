class Scoreboard extends SplashScreen {
    constructor(ctx, width, height) {
        super(ctx, width, height);

        this.font = Assets.getInstance().getFont("PressStart2P-Regular");
        this.text = new RenderText("Scoreboard", 45, vec2.fromValues(540, 150), "white", this.font);
        this.scoreText = [];
    }
    draw() {
        if(this.state == SplashState.SPLASH_IDLE) {
            if(this.idleTime !== undefined) {
                if(GlobalVars.getInstance().curtime > this.idleTime) {
                    this.state = SplashState.SPLASH_FADEOUT;
                }
            }
        }

        var scores = this.getScores();
        this.ctx.globalAlpha = 1.0;
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.text.render(this.ctx);
        this.scoreText = [];
        for(var i = 0; i < 10; i++) {
            this.scoreText[i] = new RenderText(
                scores[i].player + "..." + scores[i].score,
                20,
                vec2.fromValues(680, (i * 50) + 250), 
                "white", 
                this.font
            );
            this.scoreText[i].render(this.ctx);
        }
    }

    isHighScore(score) {
        var scores = this.getScores();
        for(var i = 0; i < 10; i++) {
            if(score > scores[i].score) {
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
                        {player: player, score: score}
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
          $.ajax({
            url: "/score",
            data: JSON.stringify(data),
            dataType: 'json',
            type: 'POST',
            crossDomain: true
          });
    }
};