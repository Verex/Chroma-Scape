class PostFXStage extends RenderingStage {
    constructor(ctx) {
        super(ctx);
        this.renderTargets = [
            new RenderTarget(ctx, ctx.canvas.width, ctx.canvas.height, false, true),
            new RenderTarget(ctx, ctx.canvas.width, ctx.canvas.height, false, true)
        ];

        this.originalSceneTarget = new RenderTarget(ctx, ctx.canvas.width, ctx.canvas.height, false, true);
        this.finalRenderTarget = new RenderTarget(ctx, ctx.canvas.width, ctx.canvas.height, false, true);

        this.copyEffect = new PostFX(ctx, this.originalSceneTarget);
        this.copyEffect.setEffectShader("Copy-Shader");

        this.brightFilterEffect = new PostFX(ctx, this.renderTargets[0]);
        this.brightFilterEffect.setEffectShader("Bright-Filter-Shader");

        this.horizontalBlurEffect = new PostFX(ctx, this.renderTargets[1]);
        this.horizontalBlurEffect.setEffectShader("Horizontal-Blur-Shader");

        this.verticalBlurEffect = new PostFX(ctx, this.renderTargets[0]);
        this.verticalBlurEffect.setEffectShader("Vertical-Blur-Shader");

        this.combineEffect = new PostFX(ctx, this.renderTargets[1]);
        this.combineEffect.setEffectShader("Combine-Shader");

        this.DOFEffect = new PostFX(ctx, this.finalRenderTarget);
        this.DOFEffect.setEffectShader("DOF-Shader");

    }

    render(root, viewport, camera, pipeline) {
        viewport.bind();
        this.copyEffect.doEffect(undefined, viewport); //Copy our scene
        this.brightFilterEffect.doEffect(undefined, viewport);
        this.horizontalBlurEffect.doEffect(this.brightFilterEffect.renderTarget, viewport);
        this.verticalBlurEffect.doEffect(this.horizontalBlurEffect.renderTarget, viewport);

        var originalTexture = this.originalSceneTarget.texture;
        var highlightTexture = this.verticalBlurEffect.renderTarget.texture;

        var program = this.combineEffect.program;
        program.activate();

        var u_highlightTextureLocation = program.uniformLocation("u_highlightTexture");

        this.renderingContext.uniform1i(u_highlightTextureLocation, 1);  // texture unit 1

        this.renderingContext.activeTexture(this.renderingContext.TEXTURE1);
        this.renderingContext.bindTexture(this.renderingContext.TEXTURE_2D, highlightTexture);
        this.renderingContext.activeTexture(this.renderingContext.TEXTURE0);

        this.combineEffect.doEffect(this.originalSceneTarget, viewport);

        this.DOFEffect.doEffect(this.combineEffect.renderTarget, viewport);
        this.DOFEffect.renderTarget.bindTexture();
    }
}