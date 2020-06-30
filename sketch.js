const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");

const settings = {
  dimensions: [2048, 2048],
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = "#F2F2F2";
    context.strokeStyle = "#CCC";
    context.stroke();
    const count = 50;

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

    const points = createGrid().filter(() => Math.random() > 0.5);
    points.forEach(([u, v]) => {
      const radius = 15;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      const color =
        colors[Math.round(lerp(0, colors.length - 1, Math.random()))];

      console.log(Math.random());
      context.beginPath();
      context.arc(x, y, radius, 0, 2 * Math.PI, false);
      context.fillStyle = color;
      context.fill();
      context.lineWidth = "10";
      context.strokeStyle = color;
      context.stroke();
    });

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
