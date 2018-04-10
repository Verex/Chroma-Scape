class Scoreboard extends SplashScreen {
    constructor(ctx, width, height) {
        super(ctx, width, height);


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
};