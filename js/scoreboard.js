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
    }
    draw() {
        if(this.state == SplashState.SPLASH_IDLE) {
            if(this.idleTime !== undefined) {
                if(GlobalVars.getInstance().curtime > this.idleTime) {
                    this.state = SplashState.SPLASH_FADEOUT;
                }
            }
        }

        var scores = this.scores;
        if(scores.length == 0) return;
        this.ctx.globalAlpha = 1.0;
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, GlobalVars.getInstance().clientWidth, GlobalVars.getInstance().clientHeight);
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

    processScores(score) {
        this.score = score;
        this.scores = this.getScores();
        if(this.isHighScore(score)) {
            this.postScore("JIT", Math.round(score));
        }
        this.scores = this.getScores();
    }

    isHighScore(score) {
        var scores = this.scores;
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