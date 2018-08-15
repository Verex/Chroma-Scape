class RenderingStage {
    constructor(ctx) {
        this.renderingContext = ctx;
        this.renderTargets = [];
    }

    delegateRender(func) {
        this.renderFunc = func;
    }

    onResize() {

    }

    render(root, viewport, camera) {
        this.rootEntity = root;
        var renderFunc = this.renderFunc;
        var recursiveRender = (ent) => {
            if(renderFunc !== undefined) {
                renderFunc.apply(this, [ent, viewport, camera]);
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