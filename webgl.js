// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");
const random = require("canvas-sketch-util/random");

const { lerp } = require("canvas-sketch-util/math");
const palletes = require("nice-color-palettes");
const glsl = require("glslify");
const count = random.rangeFloor(2, 5);
const pallete = random.shuffle(random.pick(palletes));
// .slice(0, count);
const color = random.pick(pallete);
// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const { range } = require("canvas-sketch-util/random");

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
  // attributes: { antialias: true },
  // dimentions: [512, 512],
  fps: 24,
  duration: 4,
  // wireframe: true,
};

const min = -2;
const max = 2;
const pointsCount = 8;

const sketch = ({ context, width, height }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  // WebGL background color
  renderer.setClearColor("hsl(0,0%,95%)", 1);

  // Setup a camera
  const camera = new THREE.OrthographicCamera();

  // Setup your scene
  const scene = new THREE.Scene();
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const geometry2 = new THREE.BoxGeometry(1, 1, 1);

  const meshes = [];

  function createGridPoints() {
    const points = [];
    for (let x = 1; x <= pointsCount; x++) {
      const row = [];
      for (let y = 1; y <= pointsCount; y++) {
        const u = x / (pointsCount - 1);
        const v = y / (pointsCount - 1);

        // console.log({ u, v, x, y });

        row.push([v, u, 0]);
      }
      points.push(row);
    }
    return points;
  }
  const gridPoints = createGridPoints();
  // .filter((x) => Math.random() > 5);

  // Setup a geometry

  for (let row = 0; row < pointsCount; row++) {
    let _row = [];
    for (let colum = 0; colum < pointsCount; colum++) {
      const point = gridPoints[row][colum];
      // if (!point) {
      //   break;
      // }
      const x = lerp(min, max, point[0]);
      const y = lerp(min, max, point[1]);
      const z = point[2];
      const material = new THREE.MeshStandardMaterial({
        color: random.pick(pallete),
        // fragmentShader,
        // vertexShader,
        // uniforms: {
        //   color: { value: new THREE.Color(random.pick(pallete)) },
        //   playhead: { value: 0 },
        // },
      });
      const mesh = new THREE.Mesh(random.pick([geometry]), material);

      mesh.position.set(x, y, z);

      mesh.scale.multiplyScalar(random.range(5, 10) * 0.005);
      scene.add(mesh);
      _row.push(mesh);
    }
    meshes.push(_row);
  }

  const light2 = new THREE.AmbientLight("hsl(0, 0%, 45%)");
  scene.add(light2);

  const light = new THREE.DirectionalLight("white", 0.5);
  light.position.set(0, 0, 4);
  scene.add(light);

  let p = 3;
  function calculateP() {
    setTimeout(() => {
      if (p >= pointsCount - 2) {
        p = 0;
      } else {
        p++;
      }
      calculateP();
    }, 100);
  }
  // calculateP();
  let frame = 0;
  // const centerPoint = Math.round(pointsCount/2)
  // console.log({ meshes });
  // let rendered = false;
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);

      const aspect = viewportWidth / viewportHeight;

      // Ortho zoom
      const zoom = 4.0;

      // Bounds
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;

      // Near/Far
      camera.near = -100;
      camera.far = 100;

      // Set position & look at world center
      camera.position.set(0, zoom, zoom);
      camera.lookAt(new THREE.Vector3());

      // Update the camera
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here\\\\

    render({ playhead }) {
      const offset = 0.3;
      // if (rendered) {
      //   return;
      // }

      // for (let row = 0; row < pointsCount; row++) {
      //   for (let column = 0; column < pointsCount; column++) {
      //     const point = gridPoints[row][column];
      //     const [u, v, z] = point;
      //     let x = lerp(min, max, u);
      //     let y = lerp(min, max, v);
      //     if (column === p - 3) {
      //       y = y - offset;
      //     } else if (column === p - 2) {
      //       y = y - offset * 2;
      //     } else if (column === p - 1) {
      //       y = y - offset;
      //     } else if (column === p) {
      //       y = y;
      //     } else if (column === p + 1) {
      //       y = y + offset;
      //     } else if (column === p + 2) {
      //       y = y + offset * 2;
      //     } else if (column === p + 3) {
      //       y = y + offset;
      //     }
      //     const mesh = meshes[row][column];
      //     mesh.position.set(x, y, z);
      //     // mesh.scale.multiplyScalar(2);
      //     // console.log({ mesh });
      //   }
      // }
      // setInterval(() => {
      //   p = random.rangeFloor(3, pointsCount - 3);
      //   rendered = false;
      // }, 50);

      // scene.rotation.x = playhead * 2 * Math.PI;
      scene.rotation.x = Math.sin(playhead * 2 * Math.PI) * 2;
      scene.rotation.y = Math.sin(playhead * 2 * Math.PI) * 2;
      // scene.rotation.z = Math.sin(playhead * 2 * Math.PI);

      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);
