import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

interface DebugObject {
  cubeGridSize: number;
  wireFrame: boolean;
  removeCubes: boolean;
}

const debugObject: DebugObject = {
  cubeGridSize: 2,
  wireFrame: false,
  removeCubes: false,
};

const debugGui = new GUI({
  width: 300,
  title: "Options",
});

const folder = debugGui.addFolder("Parameters");
folder.add(debugObject, "cubeGridSize", 1, 10, 1).onChange(() => {
  setupScene();
});
folder.add(debugObject, "wireFrame").onChange(() => {
  setupScene();
});
folder.add(debugObject, "removeCubes").onChange(() => {
  setupScene();
});

const windowSize = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  windowSize.width / windowSize.height,
  0.1,
  100
);
camera.position.z = 3;
camera.position.x = 2;
scene.add(camera);
const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = false;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(windowSize.width, windowSize.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

window.addEventListener("resize", () => {
  windowSize.width = window.innerWidth;
  windowSize.height = window.innerHeight;

  camera.aspect = windowSize.width / windowSize.height;
  camera.updateProjectionMatrix();

  renderer.setSize(windowSize.width, windowSize.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const vertexShader = `
    uniform mat4 projectionMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 modelMatrix;

    attribute vec3 position;
    attribute vec2 uv;
    attribute float aNumber;

    varying vec2 vUv;
    varying float vNumber;

    void main()
    {
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
        vUv = uv;
        vNumber = aNumber;
    }
`;

const fragmentShader = `
    precision highp float;

    varying vec2 vUv;
    varying float vNumber;

    float PHI = 1.61803398874989484820459;  // Φ = Golden Ratio   

    float gold_noise(vec2 xy, float seed){
        return fract(tan(distance(xy*PHI, xy)*30.0*seed)*xy.x);
    }

    void main()
    {
        float val = gold_noise(vUv, vNumber);
        gl_FragColor = vec4(val, val, val, 1.0);
    }
`;

function createGrid(length: number = 10) {
  const distance = 1 / length;
  const offset = distance / 2;
  const start = -0.5 + offset;

  const mapFn = (_: any, i: number) => start + i * distance;

  const xRange: number[] = Array.from({ length }, mapFn);

  // Create a 3D grid
  const grid: { x: number; y: number; z: number }[] = [];

  for (const x of xRange) {
    for (const y of xRange) {
      for (const z of xRange) {
        grid.push({ x, y, z });
      }
    }
  }
  return grid;
}

const light = new THREE.AmbientLight();
scene.add(light);

function setupScene() {
  let boxMaterial: THREE.Material;
  if (debugObject.wireFrame) {
    boxMaterial = new THREE.MeshBasicMaterial({ wireframe: true });
  } else {
    boxMaterial = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
    });
    boxMaterial.blending = THREE.CustomBlending;
    boxMaterial.blendEquation = THREE.AddEquation; //default 
    boxMaterial.blendSrc = THREE.OneFactor;  //default 
    boxMaterial.blendDst = THREE.ZeroFactor; //default
  }

  const removeFactor = debugObject.removeCubes ? 0.1 : 1;

  const toRemove = [];
  const size = 1 / debugObject.cubeGridSize;

  for (let j = 0; j < scene.children.length; j++) {
    if (scene.children[j].type === "Mesh") {
      toRemove.push(scene.children[j]);
    }
  }
  for (const value of toRemove) {
    scene.remove(value);
  }

  const cubeGrid = createGrid(debugObject.cubeGridSize);

  for (let i = 0; i < cubeGrid.length; i++) {
    const position = cubeGrid[i];
    const boxGeometry = new THREE.BoxGeometry(size, size, size);
    const count = boxGeometry.attributes.position.count;
    const numbers = new Float32Array(count);
    for (let j = 0; j < count; j++) {
      numbers[j] = (i + 1);
    }
    boxGeometry.setAttribute("aNumber", new THREE.BufferAttribute(numbers, 1));
    const rand = Math.random();
    if (rand > removeFactor) continue;
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(position.x, position.y, position.z);
    scene.add(box);
  }
}

setupScene();
const tick = () => {
  controls.update();

  const gl = renderer.getContext();
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.FRONT);
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
