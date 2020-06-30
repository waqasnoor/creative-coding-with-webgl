const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [2048, 2048],
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = "blue";

    context.fillRect(0, 0, width, height);
    for (let i = 1; i <= 13; i++) {
      const startPositionX = i * 150;
      for (let j = 1; j <= 13; j++) {
        context.beginPath();
        const startPositionY = j * 150;
        context.arc(startPositionX, startPositionY, 50, 0, 2 * Math.PI, false);
        context.fillStyle = "white";
        context.fill();
        context.lineWidth = "10";
        context.strokeStyle = "black";
        context.stroke();
      }
    }
  };
};

canvasSketch(sketch, settings);
