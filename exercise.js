const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const palletes = require("nice-color-palettes");
const { lerp } = require("canvas-sketch-util/math");

const count = random.rangeFloor(2, 3);

const pallete = random.shuffle(random.pick(palletes)).slice(0, count);
// const background = random.pick(palletes)[0];
const background = "#fff";

random.setSeed(random.getRandomSeed());
const settings = {
  prefix: random.getRandomSeed(),
  dimensions: [1024, 1024],
};
const margin = 30;
const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);

    const createGrid = () => {
      const count = 7;
      const points = [];
      for (let x = 1; x < count; x++) {
        for (let y = 1; y < count; y++) {
          const u = x / (count - 1);
          const v = y / (count - 1);
          points.push({ position: [u, v] });
        }
      }
      return points;
    };
    let points = createGrid();

    const getXY = ([u, v]) => {
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);
      return [x, y];
    };
    const paintRec = (p1, p3) => {
      context.beginPath();

      const r1 = random.rangeFloor(p1.position[1], p1.position[0]);
      const r2 = random.rangeFloor(p1.position[1], p3.position[0]);
      const p2 = { position: [r1, p1.position[1]] };
      const p4 = { position: [r2, p3.position[1]] };

      // ________________________________________
      // |
      // |
      // |
      // --------------------------------------------

      console.log({ p1, p2, p3, p4 });

      context.moveTo(...getXY(p1.position));
      context.lineTo(...getXY(p2.position));
      context.lineTo(...getXY(p3.position));
      context.lineTo(...getXY(p4.position));
      // const p3 = {
      //   position: getXY([random.value(), p2.position[1]]),
      // };
      // const p4 = {
      //   position: getXY([random.value(), random.value()]),
      // };

      // context.lineTo(...getXY(p2.position));
      context.lineWidth = 40;
      context.strokeStyle = background;
      context.stroke();

      context.fillStyle = `${random.pick(pallete)}`;
      context.fill();
    };

    points = random.shuffle(points);
    function generateShapes() {
      if (points.length >= 4) {
        const p1 = points.pop();
        const p2 = points.pop();
        paintRec(p1, p2);

        generateShapes();
      }
    }
    generateShapes();
  };
};

canvasSketch(sketch, settings);
