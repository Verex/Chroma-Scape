class GeometryStage extends RenderingStage {
    constructor(ctx) {
        super(ctx);
        this.renderTargets[0] = new RenderTarget(ctx, ctx.canvas.width, ctx.canvas.height, true, true); //This is our render target

    }

    onResize() {
        var ctx = this.renderingContext;
        this.renderTargets[0] = new RenderTarget(ctx, ctx.canvas.width, ctx.canvas.height, true, true); //This is our render target
    }

    render(root, viewport, camera) {
        this.renderTargets[0].bind();
        this.renderTargets[0].clear(DARK);
        super.delegateRender((ent, program) => {
            if(ent.hasComponent(ComponentID.COMPONENT_MESH)) {
                var meshComponent = ent.getComponent(ComponentID.COMPONENT_MESH);
                meshComponent.render(this.renderingContext, camera);
            }
        });
        super.render(root, viewport, camera);
        this.renderTargets[0].bindTexture(); 
    }
}