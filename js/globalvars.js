class _GlobalVars_ //Internal class
{
    constructor()
    {
        this.tickrate = 30; //Rate at which the game world updates (number of updates per second)
        this.tickinterval = 1 / this.tickrate; //Interval between game world updates in seconds
        this.frametime = 0; //The number of seconds since last update
        this.interpolation = 0; //Fraction of how far we are in between game world updates
        this.tickcount = 0; //The total number of game world updates
        this.curtime = 0; //The cumulative time SINCE the beginning of execution
        this.gametime = 0; // The cumulative time at which the gameplay started (post menu).
        this.lasttime = 0; //Previous time stamp
        this.maxtimeskip = 400;
        this.framecount = 0; //Number of frames being pushed to renderer
        this.framedelay = 0; //Number of seconds it takes to push one frame used for FPS calculation
        this.timescale = 1.0; //Scalar that affects how fast or slow time flows useful for debugging.
        //TODO(Zach): Look into maybe putting this somewhere else? I think it's fine here but it also feels kinda hacky
        this.clientWidth = 0; //We're going to go ahead and store our client width & height in the global vars
        this.clientHeight = 0;
    }

    timeToTicks(time) {
        return time * this.tickinterval;
    }
    ticksToTime(ticks) {
        return ticks * this.tickrate;
    }
    setTickrate(tickrate) {
        this.tickrate = tickrate;
        this.tickinterval = 1 / tickrate;
    }

    getTickCurtime() {
        return this.tickcount * this.tickinterval;
    }
};


/*
    JavaScript Singleton Design Pattern
    Singleton ensures that only one copy of the GlobalVars object will exist at any given time.
*/

var GlobalVars = (function(){
    var instance;
    return {
        getInstance: function(){
            if (null == instance) {
                instance = new _GlobalVars_();
                instance.constructor = null;
            }
            return instance;
        }
   };
})();
