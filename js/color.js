class Color {
    constructor(r, g, b, a) {
        this.r = r / 255;
        this.g = g / 255;
        this.b = b / 255;
        this.a = a / 255;
    }

    serialize() {
        return [
            this.r,
            this.g,
            this.b,
            this.a
        ];
    }
};

var RED = new Color(255, 0, 0, 255);
var BLUE = new Color(0, 0, 255, 255);
var GREEN = new Color(0, 255, 0, 255);
var BLACK = new Color(0, 0, 0, 255);
var WHITE = new Color(255, 255, 255, 255);