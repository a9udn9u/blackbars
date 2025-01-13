
const COLORS = [
  '#f68511',
  '#aad816',
  '#0fb5ae',
  '#ea3829',
  '#3892f3',
  '#f8d904',
  '#686df4',
  '#de3d82',
  '#33c5e8',
  '#008f5d',
  '#e055e2',
  '#27bb36',
];

const INCH_IN_CM = 2.54;

export const Utils = Object.freeze({
  computeDimension: (display: Display): Dimension => {
    const {size, ar: {x, y}} = display;
    const width = Math.sqrt(size * size / (1 + y * y /x / x));
    const height = Math.sqrt(size * size - width * width);
    return {
      width,
      height,
      diagonal: size,
      area: width * height,
      widthCm: width * INCH_IN_CM,
      heightCm: height * INCH_IN_CM,
      diagonalCm: size * INCH_IN_CM,
      areaSqcm: width * height * INCH_IN_CM * INCH_IN_CM,
    };
  },

  computeContentDimension: (
    {width: displayWidth, height: displayHeight}: Dimension,
    {x, y}: AspectRatio
  ): Dimension => {
    let width = displayWidth;
    let height = displayWidth / x * y;

    if (displayWidth / displayHeight > x / y) {
      width = displayHeight * x / y;
      height = displayHeight;
    }

    const diagonal = Math.sqrt(width * width + height * height);

    return {
      width,
      height,
      diagonal,
      area: width * height,
      widthCm: width * INCH_IN_CM,
      heightCm: height * INCH_IN_CM,
      diagonalCm: diagonal * INCH_IN_CM,
      areaSqcm: width * height * INCH_IN_CM * INCH_IN_CM,
    };
  },

  getDisplayLabel: (display: Display) => {
    return `${display.size}" ${display.ar.x}:${display.ar.y}`;
  },

  getAspectRatioLabel: (ar: AspectRatio) => {
    return `${ar.x}:${ar.y}`;
  },

  getColor: (pos: number) => COLORS[pos % COLORS.length],
});
