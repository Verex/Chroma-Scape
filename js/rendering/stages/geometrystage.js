class GeometryStage extends RenderingStage {
    constructor(ctx) {
        super(ctx);
    }


    render(root, program) {
        super.render(root);   
        var recursiveRender = (ent) => {
            if(ent.hasComponent(ComponentID.COMPONENT_MESH)) {
                var meshComponent = ent.getComponent(ComponentID.COMPONENT_MESH);
                meshComponent.render(program, this.renderingContext);
            }

            if(ent.children.length > 0) {
                for(var i = 0; i < ent.children.length; i++) {
                    var child = ent.children[i];
                    recursiveRender(child);
                }
            }
        };

        recursiveRender(root); //Start processing the tree depth first.


    }
}