const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const { lerp } = require("canvas-sketch-util/math");
const niceColors = require("nice-color-palettes");
const math = require("canvas-sketch-util/math");
random.setSeed(random.getRandomSeed());

const pallete = random.pick(niceColors);
const settings = {
  dimensions: [2048, 2048],
  animate: true,
  duration: 10,
  fps: 24,
};
const count = 10;
let frames = 0;

function createGridPoints() {
  const points = [];
  for (let i = 1; i < count; i++) {
    for (let j = 1; j < count; j++) {
      const u = random.value();
      const v = random.value();
      points.push({
        position: [u, v],
        radius: 1,
        color: random.pick(random.pick(niceColors)),
      });
    }
  }
  return points;
}
const gridPoints = createGridPoints();

const margin = 200;
let bgColor = "white";
let speed = 5;
const sketch = () => {
  return ({ context, width, height, playhead, time }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);
    function AnimateCurrentFrame() {
      const point = gridPoints[gridPoints.length - 1];
      if (!point) {
        return;
      }
      point.radius = point.radius + speed;
      // point2.radius = point.radius / 2;
      const { radius } = point;
      const [u, v] = point.position;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, width - margin, v);
      context.beginPath();

      context.arc(x, y, point.radius, 0, Math.PI * 2, false);
      context.fillStyle = point.color;
      context.fill();
      const isLeftSideTouching = x - radius <= 0;
      const isRightSideTouching = x + radius >= width;
      const isBottomTouching = y - radius <= 0;
      const isTopTouching = y + radius >= height;
      let shouldNext =
        isLeftSideTouching &&
        isBottomTouching &&
        isTopTouching &&
        isRightSideTouching;

      if (point.color == bgColor) {
        shouldNext = true;
      }
      if (shouldNext) {
        bgColor = point.color;
        gridPoints.pop();
      }
      speed = playhead * 50 + Math.abs(Math.cos(time) * 10);
    }
    AnimateCurrentFrame();
  };
};

canvasSketch(sketch, settings);
