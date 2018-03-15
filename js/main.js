class Main {
  constructor() {
    // Get Canvas DOM element.
    this.canvas = $('#glcanvas')[0];

    // Get WebGL canvas context.
    this.gl = this.canvas.getContext('webgl');

    // Ensure WebGL is working.
    if (!this.gl) {
      console.error("WebGL is not supported by your browser.");
      return;
    }

    // Start main loop.
    requestAnimationFrame(() => this.tick());
  }

  tick() {

    
    // Request next tick.
    requestAnimationFrame(() => this.tick());
  }

  update() {

  }

  draw() {

  }
}
