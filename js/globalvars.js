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
        this.framecount = 0; //Number of frames being pushed to renderer
        this.framedelay = 0; //Number of seconds it takes to push one frame used for FPS calculation
        this.timescale = 1.0; //Scalar that affects how fast or slow time flows useful for debugging.
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