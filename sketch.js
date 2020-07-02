const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");
random.setSeed(random.getRandomSeed());
const settings = {
  prefix: random.getRandomSeed(),
  dimensions: [2048, 2048],
};

const pickRandomInRange = (start, end) => {
  return Math.round(lerp(start, end, random.value()));
};
const sketch = () => {
  const count = 5;
  const palette = random.shuffle(random.pick(palettes)).slice(0, count);
  const [background] = random.shuffle(random.pick(palettes)).slice(0, 1);
  return ({ context, width, height }) => {
    context.fillStyle = background;
    const count = 50;

    context.fillRect(0, 0, width, height);
    const createGrid = () => {
      const points = [];
      for (let x = 0; x < count; x++) {
        for (let y = 0; y < count; y++) {
          const u = count <= 1 ? 0.5 : x / (count - 1);
          const v = count <= 1 ? 0.5 : y / (count - 1);
          const radius = random.noise2D(u, v);
          const rotation = random.noise2D(u, v);
          // const characters = "==";
          // const character =
          //   characters[pickRandomInRange(0, characters.length - 1)];
          const character = "=";
          const color = random.pick(palette);
          points.push({
            character,
            rotation,
            color,
            radius: Math.abs(radius) * 0.25,
            position: [u, v],
          });
        }
      }
      return points;
    };
    const margin = 200;

    let points = createGrid().filter(() => random.value() > 0.5);

    function paintChart() {
      if (!points.length) {
        return;
      }
      const index = pickRandomInRange(0, points.length - 1);

      const point = points[index];
      points = [
        ...points.slice(0, index),
        ...points.slice(index + 1, points.length),
      ];

      paintPoint(point);
      paintChart();
    }
    paintChart();

    function paintPoint({ radius, position, color, rotation, character }) {
      const [u, v] = position;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);
      context.save();
      context.translate(x, y);
      context.rotate(rotation);

      context.fillStyle = color;
      context.font = `${radius * width}px "Helvetica"`;
      context.fillText(character, 0, 0);
      context.restore();
    }
  };
};

canvasSketch(sketch, settings);
