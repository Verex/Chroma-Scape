/*
  Enum type that will represent the status of our app's setup routine
  Setup will be responsible for:
      - Determining Screen Type
      - Determining Platform (Android, PC, Etc.)
      - Setup of Audio Devices
      - Loading Assets

*/
var AppStatus = {
  STATUS_OK: 0, //Nice
  STATUS_CONNECTIONFAIL: 1, //Connection to host failed on any asset stream
  STATUS_MEMISSUE: 2, //Browser ran out of memory
  STATUS_BAD_BROWSER: 3, //Browser sucks (probably an iPhone)
};

class App {
  constructor() {
    this.start = 0; //The time in which the program began execution

    this.renderSystems = [];
    this.postRenderSystems = [];
  }

  /*
    Function: setup
    Parameters: void
    Purpose: Application setup routine, responsible for duties listed in above comments.
    Anything that needs to happen on page load goes here
  */
  setup() {
    // Get Canvas DOM element.
    this.canvas = $('#glcanvas')[0];

    // Get WebGL canvas context.
    this.gl = this.canvas.getContext('webgl');

    // Ensure WebGL is working.
    if (!this.gl) {
      console.error("WebGL is not supported by your browser.");
      return AppStatus.STATUS_BAD_BROWSER;
    }
    this.renderSystems.push(
      new Renderer(this.gl)
    );
    this.gameworld = new GameWorld();
    return AppStatus.STATUS_OK;
  }
  /*
    Function: exec
    Parameters: void
    Purpose: Begin execution of our application.
    Anything that needs to happen RIGHT before execution goes here.
  */
  exec() {
    var globals = GlobalVars.getInstance();
    globals.setTickrate(60);
    globals.timescale = 1.0;

    /*
      Setup input listeners here
    */

    //TODO(Jake): Add platform level input listening code
    requestAnimationFrame(() => this.loop());
  }


  /*
    Function: Loop
    Parameters: void
    Purpose: Powers the main loop of the application also manages all of the timers
    ECS Subsystems will be executed from here as well
  */
  loop() {
    var globals = GlobalVars.getInstance();
    var timer = Timer.getInstance();

    var time = timer.getCurrentTime();
    timer.updateTimers();

    var delta = time - globals.lasttime;
    globals.lasttime = time;

    //The target amount of time in milliseconds inbetween game world updates
    var targettime = globals.tickinterval * 1000;

    //Control the passage of time with our timescale
    delta *= globals.timescale;

    globals.frametime += delta;

    //We're going to calculate how many ticks we are about to advance, if it's really high the game thread
    // was probably sleeping and we don't need to jump a ridiculous amount of frames.
    var estimatedticks = Math.ceil(globals.frametime / targettime);
    if(estimatedticks > globals.maxtimeskip) {
      console.error("GAME WORLD ATTEMPTED TO ADVANCE: " + estimatedticks + " TICKS BUT WAS STOPPED");
      globals.frametime = 0;
    }

    /*
      We want to allow the game world to advance in time as long as we have accumulated
      enough time
    */
    while(globals.frametime >= targettime) { 
      globals.tickcount++;
      globals.frametime -= targettime;
      this.tick(globals.tickinterval);
    }
    globals.framecount++;
    globals.curtime = time;
    globals.interpolation = globals.frametime / targettime;



    // Request next tick.
    requestAnimationFrame(() => this.loop());
  }

  tick(dt) {

  }

  render() {

  }
}
