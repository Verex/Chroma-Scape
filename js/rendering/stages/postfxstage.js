class PostFXStage extends RenderingStage {
    constructor(ctx) {
        super(ctx);
        this.renderTargets = [
            new RenderTarget(ctx, ctx.canvas.width, ctx.canvas.height, false, true),
            new RenderTarget(ctx, ctx.canvas.width, ctx.canvas.height, false, true)
        ];

        this.effect = new PostFX(ctx, this.renderTargets[0]);
        this.effect.setEffectShader("CRT-Shader");
    }

    render(root, viewport, camera) {
        this.effect.doEffect(undefined, viewport);
        this.renderingContext.bindFramebuffer(this.renderingContext.FRAMEBUFFER, null);
        viewport.bind();
        viewport.render();
    }
}