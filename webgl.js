// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");
const random = require("canvas-sketch-util/random");
const palletes = require("nice-color-palettes");

const BezierEasing = require("bezier-easing");

const count = random.rangeFloor(3, 6);
const pallete = random.shuffle(random.pick(palletes)).slice(0, count);

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
  attributes: { antialias: true },
  dimentions: [512, 512],
  fps: 24,
  duration: 4,
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  // WebGL background color
  renderer.setClearColor("hsl(0, 0%, 95% )", 1);

  // Setup a camera
  const camera = new THREE.OrthographicCamera();

  // Setup your scene
  const scene = new THREE.Scene();
  const geometry = new THREE.BoxGeometry(1, 1, 1);

  const sphereGeomatery = new THREE.SphereGeometry(1, 32, 32);

  // Setup a geometry
  for (let i = 0; i < 10; i++) {
    // Setup a material
    const material = new THREE.MeshStandardMaterial({
      color: `${random.pick(pallete)}`,
      roughness: 0.75,
      flatShading: true,
    });

    // Setup a mesh with geometry + material
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    );
    mesh.scale.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    );
    mesh.scale.multiplyScalar(0.5);
    scene.add(mesh);
  }

  const light2 = new THREE.AmbientLight("hsl(0, 0%, 450%)");
  scene.add(light2);

  const light = new THREE.DirectionalLight("white", 0.5);
  light.position.set(0, 0, 4);
  scene.add(light);

  // draw each frame

  const BazierFn = BezierEasing(0.46, 0.08, 0.89, 1.95);
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);

      const aspect = viewportWidth / viewportHeight;

      // Ortho zoom
      const zoom = 2.0;

      // Bounds
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;

      // Near/Far
      camera.near = -100;
      camera.far = 100;

      // Set position & look at world center
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());

      // Update the camera
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here\\\\

    render({ time, playhead }) {
      // controls.update();
      // const speed = 2;

      const rotation = BazierFn(Math.sin(playhead * 2 * Math.PI));
      // scene.rotation.y = rotation;
      scene.rotation.x = rotation;
      // scene.rotation.z = rotation;
      // camera.rotateX(rotation);
      // scene.light.rotation.x = rotation;
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);
