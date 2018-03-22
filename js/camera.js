class Camera extends Entity {
    constructor(width, height, eid, owner) {
        super(eid, owner, EntityType.ENTITY_CAMERA);

        // Assign width and height values.
        this.width = width;
        this.height = height;

        // Setup viewing perspective.
        this.setupPerspective();

        this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);

        this.transformComponent = this.getComponent(ComponentID.COMPONENT_TRANSFORM);
    }

    setupPerspective() {
      // Calculate aspect ratio of canvas.
      this.aspectRatio = this.width / this.height;

      // Create projection matrix.
      this.projectionMatrix = mat4.create();

      // Apply perspective to projecction matrix.
      mat4.perspective(
          this.projectionMatrix,
          Math.radians(45),
          this.aspectRatio,
          0.1,
          100.0
      );
    }

    tick(dt) {
        var globals = GlobalVars.getInstance();

        // Check for canvas resize.
        if (globals.clientWidth != this.width
          || globals.clientHeight != this.height) {

          // Update current width/height.
          this.width = globals.clientWidth;
          this.height = globals.clientHeight;

          // Create new perspective.
          this.setupPerspective();
        }

        this.transformComponent.updateTransform();

        super.tick(dt);
    }
};

EntityType.ENTITY_CAMERA.construction = (owner) => {
    var globals = GlobalVars.getInstance();
    return new Camera(
        globals.clientWidth,
        globals.clientHeight,
        newID++,
        owner
    );
}
