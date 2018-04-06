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
    this.textCanvas = $('#textcanvas')[0];
    this.textCanvas.width = 2048;
    this.textCanvas.height = 2048;

    // Get WebGL canvas context.
    this.gl = this.canvas.getContext('webgl', {alpha: false});
    this.textCtx = this.textCanvas.getContext('2d');

    // Ensure WebGL is working.
    if (!this.gl) {
      return AppStatus.STATUS_BAD_BROWSER;
    }

    // Set canvas size to client sizes.
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;

    this.renderSystems.push(
      new Renderer(this.gl)
    );

    //TODO(Jake): Implement resize callback handler using Observer design pattern
    var globals = GlobalVars.getInstance();

    // Store width and heigth in globals.
    globals.clientWidth = this.canvas.clientWidth;
    globals.clientHeight = this.canvas.clientHeight;

    var assets = Assets.getInstance();
    assets.addModel(this.gl, TestMesh(), "test");
    assets.addModel(this.gl, ShipMesh(), "ship");
    assets.addModel(this.gl, GridMesh(50000, 1500), "grid");
    assets.addModel(this.gl, PortalMesh(), "portal");
    assets.addModel(this.gl, PillarMesh(), "pillar");

    // Create game world entity.
    this.gameworld = new Entity.Factory(null).ofType(EntityType.ENTITY_GAMEWORLD);

    // Create player entity.
    this.gameworld.player = new Entity.Factory(this.gameworld).ofType(EntityType.ENTITY_PLAYER);

    // Create camera entity.
    this.gameworld.player.camera = new Entity.Factory(this.gameworld.player).ofType(EntityType.ENTITY_CAMERA);
    this.gameworld.player.camera.transformComponent.absOrigin = vec3.fromValues(0, 10, 50);
    this.gameworld.player.camera.transformComponent.absRotation = vec3.fromValues(-10, 0, 0);

    this.gameworld.player.menuCamera = new Entity.Factory(this.gameworld.player).ofType(EntityType.ENTITY_CAMERA);
    this.gameworld.player.menuCamera.transformComponent.absOrigin = vec3.fromValues(0, 10, -50);
    this.gameworld.player.menuCamera.transformComponent.absRotation = vec3.fromValues(-10, 180, 0);
    this.gameworld.player.menuCamera.yawBoom = 180;
    

    // Create ship entity.
    this.gameworld.player.ship = new Entity.Factory(this.gameworld.player).ofType(EntityType.ENTITY_SHIP);
    this.gameworld.player.shipOrigin = this.gameworld.player.ship.transformComponent.absOrigin;
    this.gameworld.player.ship.physicsComponent.aabb = new AABB(this.gameworld.player.ship, 8, 1, 8);
    this.gameworld.player.ship.physicsComponent.aabb.translation = vec3.fromValues(0, -0.25, -0.13);

    // Set model for our ship.
    this.gameworld.player.ship.components[ComponentID.COMPONENT_MESH].setModel(
      assets.getModel("ship")
    );

    this.gameworld.spawner = new Entity.Factory(this.gameworld).ofType(EntityType.ENTITY_SPAWNER);

    this.testgrid = new Entity.Factory(this.gameworld).ofType(EntityType.ENTITY_DUMMY);
    this.gameworld.meshComponent.setModel(
      assets.getModel("grid")
    );

    this.gameworld.scene.mainCameraID = 1;

    //this.testgrid.transformComponent.absOrigin = vec3.fromValues(0, 0, 0);
    //this.testgrid.transformComponent.absRotation = vec3.fromValues(0, 0, 0);


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
    globals.setTickrate(240);
    globals.timescale = 1.0;

    /*
      Setup input listeners here
    */

    //TODO(Jake): Add platform level input listening code
    requestAnimationFrame(() => this.loop());
  }

  /*
    Function: loop
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

    // Check for canvas resize.
    if (this.canvas.width != this.canvas.clientWidth
    || this.canvas.height != this.canvas.clientHeight) {
        // Change canvas size.
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;

        // Update globals width/height.
        globals.clientWidth = this.canvas.clientWidth;
        globals.clientHeight = this.canvas.clientHeight;

        this.renderSystems.forEach((value, index, array) =>{
          value.onResize(0, 0);
        });

        // Update gl with viewport change.
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
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

    // Update global variables.
    globals.framecount++;
    globals.curtime = time;
    globals.interpolation = globals.frametime / targettime;

    // Call render method.
    this.render();

    // Request next tick.
    requestAnimationFrame(() => this.loop());
  }

  /*
    Function: tick
    Parameters: dt
    Purpose: Perform logical updates on all entities and components.
  */
  tick(dt) {
    this.gameworld.tick(dt);
    this.gameworld.queryCollision();
    this.gameworld.updateSceneGraph();
  }

  /*
    Function: render
    Parameters: void
    Purpose: Call and perform render functions.
  */
  render() {
    /*
      All of our render systems are responsible for rendering our gameworld
      so we're gunna pass our gameworld to our render function
    */
    this.textCtx.globalAlpha = 0.0;
    this.textCtx.fillStyle = '#F0F';
    this.textCtx.fillRect(0, 0, this.textCanvas.width, this.textCanvas.height);
    this.textCtx.globalAlpha = 1.0;
    this.textCtx.fillStyle = 'green';
    this.textCtx.fillRect(0, 0, 150, 150);
    if(testFont != null) {
      var path = testFont.getPath('Hello, World!', 0, 200, 32);
      path.fill = "white";
      path.draw(this.textCtx);
    }
    var gameworld = this.gameworld;
    
    this.renderSystems.forEach((value, index, array) => {
      value.render(gameworld);
      //value.blitCanvasTexture(this.textCanvas);
      value.postProcessing();
    });
  }
}
