class MenuController extends Entity {
    constructor(eid, owner) {
        super(eid, owner, EntityType.ENTITY_MENUCONTROLLER);

        this.componentFactory.construct(ComponentID.COMPONENT_INPUT);
        this.componentFactory.construct(ComponentID.COMPONENT_TEXT);

        this.textComponent = this.getComponent(ComponentID.COMPONENT_TEXT);
        this.menuText = "MENU";

        this.timer = 1;
        this.text = ['Press enter to play!!!', '', 'Press enter to play!!!', ''];
        this.textColors = ['white', 'white', 'red', 'red'];
        this.textIdx = 0;

        this.textPos = vec2.fromValues(
            GlobalVars.getInstance().clientWidth * 0.5,
            GlobalVars.getInstance().clientHeight * 0.85
        );

        this.textComponent.addText(
            this.text[this.textIdx],
            this.textPos,
            Assets.getInstance().getFont("PressStart2P-Regular"),
            this.menuText,
            45
        );

        this.textComponent.addText(
            "Chroma Scape",
            vec2.fromValues(
                GlobalVars.getInstance().clientWidth * 0.5,
                GlobalVars.getInstance().clientHeight * 0.15
            ),
            Assets.getInstance().getFont("PressStart2P-Regular"),
            "GAMETITLE",
            65
        );

        this.textComponent.addText(
            "J - Orange",
            vec2.fromValues(
                GlobalVars.getInstance().clientWidth * 0.75,
                GlobalVars.getInstance().clientHeight * 0.35
            ),
            Assets.getInstance().getFont("PressStart2P-Regular"),
            "ORANGE",
            30
        );
        this.textComponent.addText(
            "L - Blue",
            vec2.fromValues(
                GlobalVars.getInstance().clientWidth * 0.75,
                GlobalVars.getInstance().clientHeight * 0.55
            ),
            Assets.getInstance().getFont("PressStart2P-Regular"),
            "BLUE",
            30
        );
        this.textComponent.addText(
            "J+L - Purple",
            vec2.fromValues(
                GlobalVars.getInstance().clientWidth * 0.75,
                GlobalVars.getInstance().clientHeight * 0.45
            ),
            Assets.getInstance().getFont("PressStart2P-Regular"),
            "PURPLE",
            30
        );
        this.textComponent.addText(
            "Nothing - White",
            vec2.fromValues(
                GlobalVars.getInstance().clientWidth * 0.75,
                GlobalVars.getInstance().clientHeight * 0.25
            ),
            Assets.getInstance().getFont("PressStart2P-Regular"),
            "WHITE",
            30
        );
        this.textComponent.addText(
            "Fly through portals by matching their colors!",
            vec2.fromValues(
                GlobalVars.getInstance().clientWidth * 0.25,
                GlobalVars.getInstance().clientHeight * 0.35
            ),
            Assets.getInstance().getFont("PressStart2P-Regular"),
            "Tooltip",
            20
        );
        this.textComponent.addText(
            "These are temporary control tooltips",
            vec2.fromValues(
                GlobalVars.getInstance().clientWidth * 0.25,
                GlobalVars.getInstance().clientHeight * 0.40
            ),
            Assets.getInstance().getFont("PressStart2P-Regular"),
            "Lol",
            20
        );
        this.textComponent.setTextColor("ORANGE", 'orange');
        this.textComponent.setTextColor("BLUE", 'blue');
        this.textComponent.setTextColor("PURPLE", 'purple');
        this.textComponent.setTextColor("WHITE", 'white');
    }

    onResize(nw, nh) {
        var pos = vec2.fromValues(
            nw * 0.5,
            nh * 0.8
        );
        
        this.textComponent.addText(
            this.text[this.textIdx],
            pos,
            Assets.getInstance().getFont("PressStart2P-Regular"),
            this.menuText,
            45
        );


        this.textComponent.addText(
            "Chroma Scape",
            vec2.fromValues(
                GlobalVars.getInstance().clientWidth * 0.5,
                GlobalVars.getInstance().clientHeight * 0.15
            ),
            Assets.getInstance().getFont("PressStart2P-Regular"),
            "GAMETITLE",
            65
        );
    }

    tick(dt) {
        if(this.timer > 0) {
            this.timer -= dt;
        }
        if(this.timer <= 0) {
            this.timer = 1;
            this.textIdx = (this.textIdx + 1) % this.text.length;
            this.textComponent.addText(
                this.text[this.textIdx],
                this.textPos,
                Assets.getInstance().getFont("PressStart2P-Regular"),
                this.menuText,
                45
            );
            this.textComponent.setTextColor(this.menuText, this.textColors[this.textIdx]);
        }
    }
};

EntityType.ENTITY_MENUCONTROLLER.construction = (owner) => {
    return new MenuController(
        newID++,
        owner
    );
}
