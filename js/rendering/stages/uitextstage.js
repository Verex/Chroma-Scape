class UITextStage extends RenderingStage {
    constructor(ctx) {
        super(ctx);
    }

    render(root, program) {
        super.delegateRender((ent) => {
            if(ent.hasComponent(ComponentID.COMPONENT_TEXT)) {
                var textComponent = ent.getComponent(ComponentID.COMPONENT_TEXT);
                textComponent.render(this.renderingContext);
            }
        });
        super.render(root, program);

    }

    
}