const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const math = require("canvas-sketch-util/math");

const settings = {
  dimensions: [2048, 2048],
  animate: true,
  duration: 10,
  fps: 3,
};
const margin = 400;
const sketch = () => {
  return ({ context, width, height, playhead, time }) => {
    context.fillStyle = "#ddd";
    context.fillRect(0, 0, width, height);
    const t = Math.sin(time);

    const cx = width / 2;
    const cy = lerp(margin, height - margin, Math.abs(t));
    const DrawBall = () => {
      context.beginPath();
      context.fillStyle = `#fff`;
      const radius = (cy % 1747) * 0.05;
      context.arc(cx, cy, radius, 0, Math.PI * 2, false);
      context.fill();
    };
    const DrawShadow = () => {
      context.beginPath();
      const radius = (cy % 1747) * 0.05;

      context.fillStyle = `#333`;

      context.ellipse(
        cx,
        height - margin + 90,
        radius,
        10,
        0,
        Math.PI * 2,
        false
      );
      context.fill();
    };
    DrawBall();
    DrawShadow();
  };
};

canvasSketch(sketch, settings);
