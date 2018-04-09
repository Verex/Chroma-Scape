var SplashState = {
    SPLASH_FADEIN: 0,
    SPLASH_IDLE: 1,
    SPLASH_FADEOUT: 2,
    SPLASH_FINISHED: 3
  }

class SplashScreen {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.state = SplashState.SPLASH_FADEIN;
        this.width = width;
        this.height = height;
    }

    fadeIn(time = 500) {
        if(this.fadeInTime === undefined) {
            this.fadeInTime = GlobalVars.getInstance().curtime + time;
        }

        var fadeFraction = GlobalVars.getInstance().curtime / this.fadeInTime;

        if(fadeFraction > 1.0) {
            fadeFraction = 1.0;
            this.state = SplashState.SPLASH_IDLE;
        }
        this.ctx.fillStyle = 'black';
        this.ctx.globalAlpha = 1.0 - fadeFraction;
        if(this.ctx.globalAlpha < 0) {
            this.ctx.globalAlpha = 0.0;
        }

        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    draw() {
        if(this.state == SplashState.SPLASH_IDLE) {
            if(this.idleTime === undefined) {
                this.idleTime = GlobalVars.getInstance().curtime + 5000;
            }
            if(GlobalVars.getInstance().curtime > this.idleTime) {
                this.state = SplashState.SPLASH_FADEOUT;
            }
        }

        this.ctx.globalAlpha = 1.0;
        this.ctx.fillStyle = '#F0F';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    fadeOut(time = 500) {
        if(this.fadeOutTime === undefined) {
            this.fadeOutTime = time;
            this.startTime = GlobalVars.getInstance().curtime;
        }
        var fadeFraction = (GlobalVars.getInstance().curtime - this.startTime);
        fadeFraction /= this.fadeOutTime;
        this.ctx.fillStyle = 'black';
        this.ctx.globalAlpha = fadeFraction;
        if(this.ctx.globalAlpha >= 1.0) {
            this.state = SplashState.SPLASH_FINISHED;
        }

        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    process() {
        switch(this.state) {
            case SplashState.SPLASH_FADEIN: this.draw(); this.fadeIn(250); break;
            case SplashState.SPLASH_IDLE: this.draw(); break;
            case SplashState.SPLASH_FADEOUT: this.draw(); this.fadeOut(250); break;
            case SplashState.SPLASH_FINISHED: break;
            
        }
    }
};