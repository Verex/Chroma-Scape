class Scoreboard extends SplashScreen {
    constructor(ctx, width, height) {
        super(ctx, width, height);

        this.scoreMap = [];
        this.font = Assets.getInstance().getFont("PressStart2P-Regular");
        this.text = new RenderText("Scoreboard", 45, vec2.fromValues(0, 300), "white", this.font);
    }
    draw() {
        if(this.state == SplashState.SPLASH_IDLE) {
            if(this.idleTime !== undefined) {
                if(GlobalVars.getInstance().curtime > this.idleTime) {
                    this.state = SplashState.SPLASH_FADEOUT;
                }
            }
        }

        this.ctx.globalAlpha = 1.0;
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.text.render(this.ctx);
    }

    getScores() {
        this.scoreMap = [];
        var map = this.scoreMap;
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
            return a.score - b.score
        });
        console.log(map);
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