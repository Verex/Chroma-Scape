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

var once = false;

function makeGetRequest(url, reverse, options) {
  var scope = null,
      limit = 10,
      cb;
  $.each(options, function(i, val) {
    if (typeof val === 'string') {
      scope = val;
    } else if (typeof val === 'number') {
      limit = val;
    } else if (typeof val === 'function') {
      cb = val;
    }
  });
  $.getJSON(url + '?callback=?', {
    reverse: reverse
  }, function(data) {
    cb(data.items);
  });
}
var getLowest = function(limit, scope, cb) {
  makeGetRequest('/score', true, arguments);
};


class App {
  constructor() {
    this.start = 0; //The time in which the program began execution
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
    this.textCanvas.width = this.canvas.clientWidth * 1;
    this.textCanvas.height = this.canvas.clientHeight * 1;

    //TODO(Jake): Implement resize callback handler using Observer design pattern
    var globals = GlobalVars.getInstance();

    // Store width and heigth in globals.
    globals.clientWidth = this.canvas.clientWidth;
    globals.clientHeight = this.canvas.clientHeight;


    // Get WebGL canvas context.
    this.gl = this.canvas.getContext('webgl', {alpha: false});
    this.textCtx = this.textCanvas.getContext('2d');

    this.splash = new SplashScreen(this.textCtx, this.canvas.clientWidth, this.canvas.clientHeight);
    this.splash.state = SplashState.SPLASH_FADEIN;

    this.scoreboard = new Scoreboard(this.textCtx, this.canvas.clientWidth, this.canvas.clientHeight);
    this.scoreboard.state = SplashState.SPLASH_IDLE;

    // Ensure WebGL is working.
    if (!this.gl) {
      return AppStatus.STATUS_BAD_BROWSER;
    }

    // Set canvas size to client sizes.
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;

    this.renderingPipeline = new RenderingPipeline(this.gl);
    this.renderingPipeline.stages.push(
      new UITextStage(this.textCtx)
    );

    var assets = Assets.getInstance();
    assets.addModel(this.gl, TestMesh(), "test");
    assets.addModel(this.gl, ShipMesh(), "ship");
    assets.addModel(this.gl, GridMesh(50000, 1500), "grid");
    assets.addModel(this.gl, WallMesh(50000, 5500), "wall");
    assets.addModel(this.gl, PortalMesh(), "portal");
    assets.addModel(this.gl, PillarMesh(), "pillar");
    assets.addModel(this.gl, FloorMesh(), "floor");

    assets.addShader(this.gl, "Standard-Shader");
    assets.addShader(this.gl, "Ship-Shader");
    assets.addShader(this.gl, "Portal-Shader");
    assets.addShader(this.gl, "Pillar-Shader");
    assets.addShader(this.gl, "Laser-Wall-Shader");


    assets.addMaterial(this.gl, "Ship");
    assets.addMaterial(this.gl, "Standard");
    assets.addMaterial(this.gl, "Portal");
    assets.addMaterial(this.gl, "Pillar");
    assets.addMaterial(this.gl, "LaserWall");


    assets.addSound(
      "effects",
      new Howl({
        src: ['./assets/sounds/sprites/effects.mp3'],
        sprite: {
          portal: [0, 6852, true],
          pass1: [6852, 7758],
          pass2: [7758, 8626],
          pass3: [8626, 9507]
        },
        volume: 0
      })
    );

    // Create game world entity.
    this.gameworld = new Entity.Factory(null).ofType(EntityType.ENTITY_GAMEWORLD);
    this.gameworld.meshComponent.setModel(
      assets.getModel("grid")
    );
    this.gameworld.meshComponent.setMaterial(
      assets.getMaterial("Standard")
    );

    this.gameworld.gamestate.onGamestateChanged.push(
      {owner:this, cb:this.onGameStateChanged}
    );

    return AppStatus.STATUS_OK;
  }

  newGame() {
    var assets = Assets.getInstance();

    newID = 1;
    this.gameworld.children = [];

    // Create player entity.
    this.gameworld.player = new Entity.Factory(this.gameworld).ofType(EntityType.ENTITY_PLAYER);
    this.gameworld.menucontroller = new Entity.Factory(this.gameworld).ofType(EntityType.ENTITY_MENUCONTROLLER);

    this.gameworld.gamestate.localplayer = this.gameworld.player;

    // Create camera entity.
    this.gameworld.player.camera = new Entity.Factory(this.gameworld.player).ofType(EntityType.ENTITY_CAMERA);
    this.gameworld.player.camera.transformComponent.absOrigin = vec3.fromValues(0, 10, 50);
    this.gameworld.player.camera.transformComponent.absRotation = vec3.fromValues(-10, 0, 0);

    // Create menu camera entity.
    this.gameworld.player.menuCamera = new Entity.Factory(this.gameworld.player).ofType(EntityType.ENTITY_CAMERA);
    this.gameworld.player.menuCamera.transformComponent.absOrigin = vec3.fromValues(0, 10, -50);
    this.gameworld.player.menuCamera.transformComponent.absRotation = vec3.fromValues(-10, 180, 0);
    this.gameworld.player.menuCamera.yawBoom = 180;

    // Create ship entity.
    this.gameworld.player.ship = new Entity.Factory(this.gameworld.player).ofType(EntityType.ENTITY_SHIP);
    this.gameworld.player.shipOrigin = this.gameworld.player.ship.transformComponent.absOrigin;
    this.gameworld.player.ship.physicsComponent.aabb = new AABB(this.gameworld.player.ship, 8, 1, 8);
    this.gameworld.player.ship.physicsComponent.aabb.translation = vec3.fromValues(0, -0.25, -0.13);

    this.gameworld.floor = new Entity.Factory(this.gameworld).ofType(EntityType.ENTITY_DUMMY);
    this.gameworld.floor.transformComponent.absOrigin = vec3.fromValues(0, -5, 0);
    this.gameworld.floor.meshComponent.setModel(
      assets.getModel("floor")
    );

    this.gameworld.cleanupEntities();


    //  Create spawner object.
    //this.test = new Entity.Factory(this.gameworld).ofType(EntityType.ENTITY_SPEAKER);
    //this.test.transformComponent.absOrigin = vec3.fromValues(0, 0, 0);

    if(this.gameworld.scoreboardcontroller !== undefined) {
      this.gameworld.scoreboardcontroller.destroy();
      this.gameworld.scoreboardcontroller = undefined;
    }

    /*
    this.gameworld.speakerTwo = new Entity.Factory(this.gameworld).ofType(EntityType.ENTITY_SPEAKER);
    this.gameworld.speakerTwo.transformComponent.absOrigin[Math.Z] = 1000;
    this.gameworld.speakerTwo.setSound("effects", "portal");
    */

    this.gameworld.scene.mainCameraID = 1;
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

        this.textCanvas.width = this.canvas.width * 1;
        this.textCanvas.height = this.canvas.height * 1;

        // Update globals width/height.
        globals.clientWidth = this.canvas.clientWidth;
        globals.clientHeight = this.canvas.clientHeight;

        /*
        this.renderSystems.forEach((value, index, array) =>{
          value.onResize(0, 0);
        });
        */
        this.renderingPipeline.onResize();

        this.splash.onResize(this.textCanvas.width, this.textCanvas.height);
        this.scoreboard.onResize(this.textCanvas.width, this.textCanvas.height);

        if(this.gameworld.hudcontroller !== undefined) {
          this.gameworld.hudcontroller.onResize(this.textCanvas.width, this.textCanvas.height);
        }
        if(this.gameworld.menucontroller !== undefined) {
          this.gameworld.menucontroller.onResize(this.textCanvas.width, this.textCanvas.height);
        }
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
    if(this.gameworld) {
      var currentState = this.gameworld.gamestate.currentState;
      if(currentState > GameStates.GAMESTATE_SPLASHFINISHED && currentState < GameStates.GAMESTATE_HISCORE) {
        this.gameworld.tick(dt);
        this.gameworld.queryCollision();
        this.gameworld.updateSceneGraph();
      } else if(currentState == GameStates.GAMESTATE_HISCORE) {
        this.scoreboard.update();
      }
    }
  }

  onGameStateChanged(oldState, newState) {
    if (newState == GameStates.GAMESTATE_MENU && oldState == GameStates.GAMESTATE_HISCORE) {
      this.gameworld.menucontroller = new Entity.Factory(this.gameworld).ofType(EntityType.ENTITY_MENUCONTROLLER);
    }
    if(newState == GameStates.GAMESTATE_MENUPAN) {
      this.gameworld.menucontroller.destroy();
    }
    if(newState == GameStates.GAMESTATE_GAME) {
      this.gameworld.hudcontroller = new Entity.Factory(this.gameworld).ofType(EntityType.ENTITY_HUDCONTROLLER);
    }
    if(newState == GameStates.GAMESTATE_HISCORE) {
      this.scoreboard.scoreState = ScoreState.SS_INACTIVE;
      this.scoreboard.processScores(this.gameworld.gamestate.score);
      if(this.gameworld.hudcontroller !== undefined) {
        this.gameworld.hudcontroller.destroy();
        this.gameworld.hudcontroller = undefined;
      }
    }
  }


  processSplashScreen() {
    this.splash.process();
    if(this.splash.state == SplashState.SPLASH_FADEIN_FINISHED) {
      this.newGame();
      console.log("GAME SPAWNED LETS DO THIS");
      this.splash.idleTime = GlobalVars.getInstance().curtime + 2000;
      this.splash.state = SplashState.SPLASH_IDLE;
    }
    if(this.splash.state == SplashState.SPLASH_FINISHED) {
      var timer = Timer.getInstance();
      timer.createRelativeTimer("GAMESTART", 2500, () => {
        this.gameworld.gamestate.currentState = GameStates.GAMESTATE_MENU;
        this.textCtx.save();
        this.textCtx.setTransform(1, 0, 0, 1, 0, 0)
        this.textCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.textCtx.restore();
    }, this, null, false);
    }
  }

  processHighScore() {
    this.scoreboard.process();
    if (this.scoreboard.state == SplashState.SPLASH_FINISHED) {
      var timer = Timer.getInstance();
      timer.createRelativeTimer("GAMESTART", 2500, () => {
        this.gameworld.cleanupEntities();
        this.gameworld.gamestate.score = 0;
        this.gameworld.gamestate.currentState = GameStates.GAMESTATE_MENU;
        this.scoreboard = new Scoreboard(this.textCtx, this.canvas.clientWidth, this.canvas.clientHeight);
        this.scoreboard.state = SplashState.SPLASH_IDLE;
        this.textCtx.save();
        this.textCtx.setTransform(1, 0, 0, 1, 0, 0)
        this.textCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.textCtx.restore();
      }, this, null, false);
    }
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
   
    var gameworld = this.gameworld;
    if(gameworld) {
      var currentState = gameworld.gamestate.currentState;
      if(currentState > GameStates.GAMESTATE_SPLASH && currentState < GameStates.GAMESTATE_HISCORE) {
        this.textCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        var scene = gameworld.scene;
        this.renderingPipeline.processScene(scene);
      } else {
        switch(currentState) {
          case GameStates.GAMESTATE_SPLASH: this.processSplashScreen(); break;
          case GameStates.GAMESTATE_HISCORE: this.processHighScore(); break;
        }
      }
    }
  }
}
