const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");

const settings = {
  dimensions: [2048, 2048],
};

const pickRandomInRange = (start, end) => {
  return Math.round(lerp(start, end, random.value()));
};
const sketch = () => {
  const count = random.rangeFloor(2, 6);
  const palette = random.shuffle(random.pick(palettes)).slice(0, count);
  const [background] = random.shuffle(random.pick(palettes)).slice(0, 1);
  return ({ context, width, height }) => {
    context.fillStyle = background;
    context.stroke();
    const count = 30;

    context.fillRect(0, 0, width, height);
    const createGrid = () => {
      const points = [];
      for (let x = 0; x < count; x++) {
        for (let y = 0; y < count; y++) {
          const u = count < 1 ? 0.5 : x / (count - 1);
          const v = count < 1 ? 0.5 : y / (count - 1);
          points.push({
            radius: Math.abs(random.gaussian() * 20),
            position: [u, v],
          });
        }
      }
      return points;
    };
    const margin = 200;

    // random.setSeed(512);
    let points = createGrid().filter(() => random.value() > 0.5);

    function paintChart() {
      if (!points.length) {
        return;
      }
      const randIndex = pickRandomInRange(0, points.length - 1);
      const point = points[randIndex];
      points = [
        ...points.slice(0, randIndex),
        ...points.slice(randIndex + 1, points.length),
      ];
      paintPoint(point);
      setTimeout(paintChart, 0);
      // paintChart();
    }
    paintChart();

    function paintPoint({ radius, position }) {
      const [u, v] = position;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      const color = random.pick(palette);

      context.beginPath();
      context.arc(x, y, radius, 0, 2 * Math.PI, false);
      context.fillStyle = color;
      context.fill();
    }
  };
};

canvasSketch(sketch, settings);
