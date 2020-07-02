const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const palletes = require("nice-color-palettes");
const { lerp } = require("canvas-sketch-util/math");

const pallete = random.pick(palletes);
const background = random.pick(palletes)[0];

random.setSeed(random.getRandomSeed());
const settings = {
  prefix: random.getRandomSeed(),
  dimensions: [2048, 2048],
};
const margin = 200;
const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = "#fff";
    context.fillRect(0, 0, width, height);

    const createGrid = () => {
      const count = 30;
      const points = [];
      for (let x = 1; x < count; x++) {
        for (let y = 1; y < count; y++) {
          const u = x / count;
          const v = y / count;
          points.push({ position: [u, v] });
        }
      }
      return points;
    };
    let points = createGrid();
    points = points.filter(() => Math.random() > 0.5);
    const getXY = ([u, v]) => {
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);
      return [x, y];
    };
    const paintRec = (p1, p2, p3, p4) => {
      context.beginPath();
      context.moveTo(...getXY(p1.position));

      context.lineTo(...getXY(p2.position));

      context.lineTo(...getXY(p3.position));
      context.lineTo(...getXY(p4.position));

      context.fillStyle = random.pick(pallete);
      context.fill();
    };

    const paintCircle = ({ position }) => {
      const radius = Math.abs(random.noise2D(...position)) * 0.1 * width;
      const [x, y] = getXY(position);
      let startAngle = random.rangeFloor(0, Math.PI * 2);
      let endAngle = random.rangeFloor(0, Math.PI * 2);
      if (startAngle > endAngle) {
        const temp = startAngle;
        startAngle = endAngle;
        endAngle = temp;
      }
      context.beginPath();
      context.arc(x, y, radius, startAngle, endAngle, false);
      context.fillStyle = random.pick(pallete);
      context.fill();
    };

    const paintCharacter = ({ position }) => {
      const [x, y] = getXY(position);

      const radius = random.noise2D(...position) * 0.1;
      const rotation = random.noise2D(...position);

      context.save();
      context.translate(x, y);
      context.rotate(rotation);
      const character = "=";
      context.fillStyle = random.pick(pallete);
      context.font = `${radius * width}px "Helvetica"`;
      context.fillText(character, 0, 0);
      context.restore();
    };

    points = random.shuffle(points);
    function generateShapes() {
      const type = random.pick(["circle", "polygon", "character"]);
      if (points.length >= 4 && type === "polygon") {
        const p1 = points.pop();
        const p2 = points.pop();
        const p3 = points.pop();
        const p4 = points.pop();
        paintRec(p1, p2, p3, p4);
      }
      if (points.length && type === "circle") {
        const p = points.pop();
        paintCircle(p);
      }
      if (points.length && type === "character") {
        const p = points.pop();
        paintCharacter(p);
      }

      if (points.length) {
        generateShapes();
      }
    }
    generateShapes();
  };
};

canvasSketch(sketch, settings);
