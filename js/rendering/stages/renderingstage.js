class RenderingStage {
    constructor(ctx) {
        this.renderingContext = ctx;
    }

    delegateRender(func) {
        this.renderFunc = func;
    }

    render(root, program) {
        this.rootEntity = root;
        var renderFunc = this.renderFunc;
        var recursiveRender = (ent) => {
            if(renderFunc !== undefined) {
                renderFunc.apply(this, [ent, program]);
            }

            if(ent.children.length > 0) {
                for(var i = 0; i < ent.children.length; i++) {
                    var child = ent.children[i];
                    recursiveRender(child);
                }
            }
        }
        recursiveRender(root);
    }
}