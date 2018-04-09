class ScoreboardController extends Entity {
    constructor(eid, owner) {
        super(eid, owner, EntityType.ENTITY_SCOREBOARDCONTROLLER);
        this.componentFactory.construct(ComponentID.COMPONENT_INPUT);
        this.componentFactory.construct(ComponentID.COMPONENT_TEXT);

        this.textComponent = this.getComponent(ComponentID.COMPONENT_TEXT);
        this.scoreHeaderName = "SCORE";

        this.timer = 1;
        this.text = ['High Scores'];
        this.textColors = ['white'];
        this.textIdx = 0;

        this.textComponent.addText(
            this.text[this.textIdx],
            vec2.fromValues(450, 400),
            Assets.getInstance().getFont("PressStart2P-Regular"),
            this.scoreHeaderName,
            50
        );
    }
}

EntityType.ENTITY_SCOREBOARDCONTROLLER.construction = (owner) => {
    return new MenuController(
        newID++,
        owner
    );
}
