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
        var pos = this.pos;
        var size = this.measureText(this.text, this.font, this.size);
        this.path = this.font.getPath(
            this.text, 
            pos[Math.X] - size.width / 2,
            pos[Math.Y],
            this.size
        );
    }

    render(ctx) {
        this.path.fill = this.color;
        this.path.draw(ctx);
    }

    measureText(text, font, fontSize) {
        var ascent = 0;
        var descent = 0;
        var width = 0;
        var scale = 1 / font.unitsPerEm * fontSize;
        var glyphs = font.stringToGlyphs(text);
    
        for (var i = 0; i < glyphs.length; i++) {
            var glyph = glyphs[i];
            if (glyph.advanceWidth) {
                width += glyph.advanceWidth * scale;
            }
            if (i < glyphs.length - 1) {
                var kerningValue = font.getKerningValue(glyph, glyphs[i + 1]);
                width += kerningValue * scale;
            }
            ascent = Math.max(ascent, glyph.yMax);
            descent = Math.min(descent, glyph.yMin);
        }
    
        return {
            width: width,
            actualBoundingBoxAscent: ascent * scale,
            actualBoundingBoxDescent: descent * scale,
            fontBoundingBoxAscent: font.ascender * scale,
            fontBoundingBoxDescent: font.descender * scale
        };
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
