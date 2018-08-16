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
var DARK = new Color(5, 13, 16);
var COLORSET = [
  new Color(230, 255, 255),
  new Color(175, 33, 8),
  new Color(8, 47, 175),
  new Color(135, 9, 153)
];

var RANDOM = () => {
    return new Color(
        Math.randInt(0, 255),
        Math.randInt(0, 255),
        Math.randInt(0, 255),
        255
    );
}