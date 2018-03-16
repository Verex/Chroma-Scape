class GLShader {
  constructor(main) {
    // Declare vertex and frag shader source.
    this.vsSource = null;
    this.fsSource = null;

    // Declare state of shader vs and fs.
    this.shaderSourceLoaded = false;

    // Declare state of shader control class initialization.
    this.initialized = false;

    // Request shader data from the server.
    this.fetchShaderData();
  }

  initializeShaderProgram(main) {
    // Convert shader sources into shader objects.
    const vertexShader = this.loadShader(main, main.gl.VERTEX_SHADER, this.vsSource);
    const fragmentShader = this.loadShader(main, main.gl.FRAGMENT_SHADER, this.fsSource);

    // Create the shader program object.
    const shaderProgram = main.gl.createProgram();

    // Attach created shaders to shader program.
    main.gl.attachShader(shaderProgram, vertexShader);
    main.gl.attachShader(shaderProgram, fragmentShader);

    // Link shader program to this gl context.
    main.gl.linkProgram(shaderProgram);

    // Check if shader program link failed.
    if (!main.gl.getProgramParameter(shaderProgram, main.gl.LINK_STATUS)) {
      console.error('Unable to initialize shader program.');

      return null;
    }

    return shaderProgram;
  }

  initialize(main) {
    // Set up shader program.
    const shaderProgram = this.initializeShaderProgram(main);

    // Store shader program information into object.
    this.programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: main.gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        vertexColor: main.gl.getAttribLocation(shaderProgram, 'aVertexColor')
      },
      uniformLocations: {
        projectionMatrix: main.gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
        modelViewMatrix: main.gl.getUniformLocation(shaderProgram, 'uModelViewMatrix')
      }
    };

    // Set status of initialization.
    this.initialized = true;

    console.log("Shader controller initialized...");
  }

  loadShader(main, type, source) {
    // Create shader object.
    const shader = main.gl.createShader(type);

    // Apply shader source data to shader object.
    main.gl.shaderSource(shader, source);

    // Compile the shader program
    main.gl.compileShader(shader);

    // Verify shader was compiled successfully.
    if (!main.gl.getShaderParameter(shader, main.gl.COMPILE_STATUS)) {
      console.error('Error loading shader: ' + main.gl.getShaderInfoLog(shader));
      main.gl.deleteShader(shader);

      return null;
    }

    return shader;
  }

  fetchShaderData() {
    /*
      Load shaders from server with ajax request
    */

    console.log("Fetching shader sources from server...");

    (function(c) {
      // Request vertex shader.
      $.ajax({
        url: 'shaders/vertex.glsl',
        success: (data) => {
          c.vsSource = data;
          console.log('Vertex shader source loaded...');
        },
        error: (msg) => {
          console.error('Could not load vertex shader.');
        }
      });

      // Request fragment shader.
      $.ajax({
        url: 'shaders/fragment.glsl',
        success: (data) => {
          c.fsSource = data;
          console.log('Fragment shader source loaded...');
        },
        error: (msg) => {
          console.error('Could not load fragment shader.');
        }
      });
    }(this));
  }

  update(main) {
    // Check if the shaders are ready to be initialized.
    if (this.vsSource != null && this.fsSource != null && !this.initialized) {
      console.log("Beginning shader intialization...");

      // Initializing shader program.
      this.initialize(main);
    }
  }
}
