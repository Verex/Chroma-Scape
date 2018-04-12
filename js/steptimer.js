/*
    Milisecond is the highest resolution we can squeeze out of non-chrome browsers
    Go figure /shrug

    Use this class to perform timed execution of function callbacks also to power our main loop
*/

var TimerStatus = {
    TIMER_DONE: 0,
    TIMER_TICKING: 1,
    TIMER_PAUSED: 2,    
    TIMER_FAILED: 3
};

class TimerEntry
{
    constructor(time, callback, owner, args, repeat) {
        this.time = time; //Time our timer will execute
        this.callback = callback; //Callback function supplied to timer
        this.owner = owner; //Owner of the timer
        this.args = args; //Arguments if any
        this.paused = false; //TODO(any): Deal with this later
        this.repeat = repeat;
        this.relative = false;
    }

    pause(time) {
        this.paused = true;
        this.addTime = (this.time - time);
    }

    resume() {
        this.paused = false;
    }

    tick(time) {
        if(this.paused) {
            //TODO(Jake): If relative, timer needs to be adjusted otherwise when timer is unpaused the callback will be
            // triggered on the next cycle if the current time has exceeded the timer time.
            if(this.addTime !== undefined && this.addTime > 0) {
                this.time += this.addTime;
            }
            return TimerStatus.TIMER_PAUSED;
        }
        if(time >= this.time) {
            this.callback.apply(this.owner, this.args);
            return TimerStatus.TIMER_DONE;
        }

        return TimerStatus.TIMER_TICKING;
    }
};

class _StepTimer_ //Internal class
{
    constructor()
    {
        this.start = Date.now();
        this.timers = {};
    }

    getCurrentTime() {
        return Date.now() - this.start;
    }

    /*
        Function: updateTimers
        Parameters: void
        Purpose:
            Update our timers and execute any callbacks if we need to
    */
    updateTimers() {
        for(var key in this.timers) {
            if(this.timers.hasOwnProperty(key)) {
                if(this.timers[key].tick(this.getCurrentTime()) == TimerStatus.TIMER_DONE) {
                    if(this.timers[key].repeat) {
                        this.timers[key].time += this.timers[key].relativeTime;
                    } else {
                        this.timers[key] = null;
                        delete this.timers[key];
                    }
                }
            }
        }
    }

    /*
        Function: createRelativeTimer
        Parameters: @name: string - Name of timer
                    @time: number - Delay in MS before callback occurs
                    @callback: function - Routine to be executed
                    @owner: Object - Class Object that owns the callback (if any)
                    @args: Array - Array of parameters to be passed to callback (if any)
        Purpose:
                Create a named timer to execute a specific task after a specified number of milliseconds.
    */
    createRelativeTimer(name, time, callback, owner, args, repeat = false) {
        if(this.timers[name] == null) {
            this.timers[name] = new TimerEntry(
                this.getCurrentTime() + time,
                callback,
                owner,
                args,
                repeat
            );
            this.timers[name].relativeTime = time;
        }
        return this.timers[name];

    }


    pauseTimer(name) {
        this.timers[name].pause(this.getCurrentTime());
    }

    resumeTimer(name) {
        this.timers[name].resume();
    }
};


/*
    JavaScript Singleton Design Pattern
    Singleton ensures that only one copy of the GlobalVars object will exist at any given time.
*/

var Timer = (() => {
    var instance;
    return {
        getInstance: () => {
            if (instance == null) {
                instance = new _StepTimer_();
            }
            return instance;
        }
   };
})();
