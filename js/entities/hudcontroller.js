class HUDController extends Entity {
    constructor(eid, owner) {
        super(eid, owner, EntityType.ENTITY_HUDCONTROLLER);

        this.componentFactory.construct(ComponentID.COMPONENT_TEXT);

        this.textComponent = this.getComponent(ComponentID.COMPONENT_TEXT);
        this.scoreText = "SCORE";
        this.scoreTag = "SCORE_TAG";

        var pos = vec2.fromValues(
            GlobalVars.getInstance().clientWidth * 0.5,
            GlobalVars.getInstance().clientHeight * 0.1
        );
        this.textComponent.addText(
            "Score:",
            pos,
            Assets.getInstance().getFont("PressStart2P-Regular"),
            this.scoreText,
            15
        );

        this.score = 0;
    }

    updateScore(score) {
        this.score = score;
    }

    onResize(nw, nh) {
        var pos = vec2.fromValues(
            nw * 0.5,
            nh * 0.1
        );
        this.textComponent.addText(
            "Score:",
            pos,
            Assets.getInstance().getFont("PressStart2P-Regular"),
            this.scoreText,
            15
        );   
    }

    tick(dt) {
        var scoreText = Math.round(this.score).toString();
        this.textComponent.addText(
            scoreText,
            vec2.fromValues(GlobalVars.getInstance().clientWidth / 2 + 100, 50),
            Assets.getInstance().getFont("PressStart2P-Regular"),
            this.scoreTag,
            15
        );
    }
};

EntityType.ENTITY_HUDCONTROLLER.construction = (owner) => {
    return new HUDController(
        newID++,
        owner
    );
}
