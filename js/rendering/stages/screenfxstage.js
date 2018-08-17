class ScreenFXStage extends RenderingStage {
    constructor(ctx) {
        super(ctx);
        this.renderTargets = [
            new RenderTarget(ctx, ctx.canvas.width, ctx.canvas.height, false, true),
            new RenderTarget(ctx, ctx.canvas.width, ctx.canvas.height, false, true)
        ];


        this.crtEffect = new PostFX(ctx, this.renderTargets[0]);
        this.crtEffect.setEffectShader("CRT-Shader");

        this.chromaticAbberationEffect = new PostFX(ctx, this.renderTargets[1]);
        this.chromaticAbberationEffect.setEffectShader("Chromatic-Abberation-Shader");

        this.viewportOutput = new PostFX(ctx, null);
        this.viewportOutput.setEffectShader("Viewport-Shader");
    }


    render(root, viewport, camera) {
        this.chromaticAbberationEffect.doEffect(undefined, viewport);
        this.crtEffect.doEffect(this.chromaticAbberationEffect.renderTarget, viewport);
        this.viewportOutput.doEffect(this.crtEffect.renderTarget, viewport); //Render our game
    }
}