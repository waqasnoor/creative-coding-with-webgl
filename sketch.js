const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");

const settings = {
  dimensions: [2048, 2048],
};
const getRandomIndex = (start, end) => {
  return Math.round(lerp(start, end, Math.random()));
};
const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = "#F2F2F2";
    context.strokeStyle = "#CCC";
    context.stroke();
    const count = 100;

    context.fillRect(0, 0, width, height);
    const createGrid = () => {
      const points = [];
      for (let x = 0; x < count; x++) {
        for (let y = 0; y < count; y++) {
          const u = count < 1 ? 0.5 : x / (count - 1);
          const v = count < 1 ? 0.5 : y / (count - 1);
          points.push([u, v]);
        }
      }
      return points;
    };
    const margin = 50;
    const colors = ["#49A669", "#BF544B"];
    random.setSeed(512);

    let points = createGrid().filter(() => random.value() > 0.5);

    function paintChart() {
      if (!points.length) {
        return;
      }
      const randIndex = getRandomIndex(0, points.length - 1);
      const point = points[randIndex];
      points = [
        ...points.slice(0, randIndex),
        ...points.slice(randIndex + 1, points.length),
      ];
      paintPoint(point);
      setTimeout(paintChart, 5);
    }
    paintChart();

    function paintPoint([u, v]) {
      const radius = 5;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      const color = colors[getRandomIndex(0, colors.length - 1)];

      console.log(Math.random());
      context.beginPath();
      context.arc(x, y, radius, 0, 2 * Math.PI, false);
      context.fillStyle = color;
      context.fill();
      context.lineWidth = "10";
      context.strokeStyle = color;
      context.stroke();
    }
    // points.forEach((val) => {
    //   paintPoint(val);
    // });

    // const count = 10;
    // for (let x = 0; x < count; x++) {
    //   const startPositionX = x * 150;
    //   for (let y = 1; y < count; y++) {
    //     const u = x / count;
    //     const v = y / count;
    //     context.beginPath();
    //     const startPositionY = y * 150;
    //     context.arc(startPositionX, startPositionY, 50, 0, 2 * Math.PI, false);
    //     context.fillStyle = "white";
    //     context.fill();
    //     context.lineWidth = "10";
    //     context.strokeStyle = "black";
    //     context.stroke();
    //   }
    // }
  };
};

canvasSketch(sketch, settings);
