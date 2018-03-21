class Camera extends Entity {
    constructor(width, height, eid, owner) {
        super(eid, owner, EntityType.ENTITY_CAMERA);

        this.componentFactory.construct(ComponentID.COMPONENT_TRANSFORM);

        this.width = width;
        this.height = height;

        this.aspectRatio = this.width / this.height;
        this.projectionMatrix = mat4.create();

        mat4.perspective(
            this.projectionMatrix,
            Math.radians(45),
            this.aspectRatio,
            0.1,
            100.0
        );

        var pos = vec3.fromValues(6, 8, -30);
        mat4.translate(
            this.components[ComponentID.COMPONENT_TRANSFORM].transform,
            this.components[ComponentID.COMPONENT_TRANSFORM].transform,
            pos
        );
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