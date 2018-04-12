var SplashState = {
    SPLASH_FADEIN: 0,
    SPLASH_FADEIN_FINISHED:1,
    SPLASH_IDLE: 2,
    SPLASH_FADEOUT: 3,
    SPLASH_FINISHED: 4
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
            this.state = SplashState.SPLASH_FADEIN_FINISHED;
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
            if(this.idleTime !== undefined) {
                if(GlobalVars.getInstance().curtime > this.idleTime) {
                    this.state = SplashState.SPLASH_FADEOUT;
                }
            }
        }
        var globals = GlobalVars.getInstance();
        this.ctx.globalAlpha = 1.0;
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);

        var img = document.getElementById("hiddenSplash");

        // Calculate rendered size of splash image.
        var height = Math.min(this.height * 0.6, img.height),
            width = height * 3,
            x = (this.width * 0.5) - (width * 0.5),
            y = (this.height * 0.5) - (height * 0.5);

        // Draw splash image.
        this.ctx.drawImage(img, x, y, width, height);
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

    onResize(nw, nh) {

    }

    process() {
        switch(this.state) {
            case SplashState.SPLASH_FADEIN: this.draw(); this.fadeIn(250); break;
            case SplashState.SPLASH_FADEIN_FINISHED:
            case SplashState.SPLASH_IDLE: this.draw(); break;
            case SplashState.SPLASH_FADEOUT: this.draw(); this.fadeOut(750); break;
            case SplashState.SPLASH_FINISHED: break;

        }
    }
};
