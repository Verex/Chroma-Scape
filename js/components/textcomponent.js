class RenderText {
    constructor(text, size, pos, color, font) {
        this.color = color;
        this.text = text;
        this.size = size;
        this.pos = pos;
        this.font = font;

        this.generate();
    }

    generate() {
        this.path = this.font.getPath(
            this.text, 
            this.pos[Math.X],
            this.pos[Math.Y],
            this.size
        );
    }

    render(ctx) {
        this.path.fill = this.color;
        this.path.draw(ctx);
    }
}

class TextComponent extends EntityComponent {
    constructor(owner) {
        super(ComponentID.COMPONENT_TEXT, owner);
        this.text = new Map();
    }

    addText(text, pos, font, name, size, color) {
        if(color == undefined) color = "white";
        if(size == undefined) size = 30;

        this.text[name] = new RenderText(
            text,
            size,
            pos,
            color,
            font
        );
    }

    setTextColor(name, color) {
        this.text[name].color = color;
        this.text[name].generate();
    }

    render(ctx) {
        for(var key in this.text) {
            if(this.text.hasOwnProperty(key)) {
                this.text[key].render(ctx);
            }
        }
    }
};
