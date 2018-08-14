class GeometryStage extends RenderingStage {
    constructor(ctx) {
        super(ctx);
    }


    render(root, program, camera) {
        super.delegateRender((ent, program) => {
            if(ent.hasComponent(ComponentID.COMPONENT_MESH)) {
                var meshComponent = ent.getComponent(ComponentID.COMPONENT_MESH);
                meshComponent.render(program, this.renderingContext, camera);
            }
        });
        super.render(root, program);
    }
}