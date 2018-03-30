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
          600.0
      );
    }

    getViewProjectionMatrix() {
        var ret = mat4.create();
        mat4.invert(ret, this.transformComponent.worldTransform);
        mat4.multiply(ret, this.projectionMatrix, ret);
        return ret;
    }

    getInvViewProjectionMatrix() {
        var ret = this.getViewProjectionMatrix();
        mat4.invert(ret, ret);
        return ret;
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
        /*
            HACK HACK: This math is NOT right at all but somehow works if you are either orbiting on yaw or pitch
        */
        if(this.boomAngle !== undefined && this.boomRadius !== undefined) {
            var cp = Math.cos(Math.radians(this.boomAngle[Math.PITCH]));
            var sp = Math.sin(Math.radians(this.boomAngle[Math.PITCH]));
            var cy = Math.cos(Math.radians(this.boomAngle[Math.YAW]));
            var sy = Math.sin(Math.radians(this.boomAngle[Math.YAW]));
            var r = this.boomRadius;
            this.transformComponent.absOrigin[Math.X] = r * sy * cp;
            this.transformComponent.absOrigin[Math.Y] = r * cy * sp;
            this.transformComponent.absOrigin[Math.Z] = r * cp * cy;
            this.transformComponent.absRotation[Math.PITCH] = -this.boomAngle[0];
            this.transformComponent.absRotation[Math.YAW] = this.boomAngle[1];
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
