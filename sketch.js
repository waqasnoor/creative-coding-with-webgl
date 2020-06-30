const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");

const settings = {
  dimensions: [2048, 2048],
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = "blue";

    const count = 5;

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
    const margin = 200;
    const points = createGrid();
    points.forEach(([u, v]) => {
      const radius = 150;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      context.beginPath();
      context.arc(x, y, radius, 0, 2 * Math.PI, false);
      context.fillStyle = "white";
      context.fill();
      context.lineWidth = "10";
      context.strokeStyle = "black";
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
