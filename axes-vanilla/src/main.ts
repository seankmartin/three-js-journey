import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { seededRandom } from 'three/src/math/MathUtils';
import GUI from 'lil-gui'

interface DebugObject {
  numSpheres: number
  rotation: boolean
  normalise: boolean
  color: boolean
  hide: boolean
}

const LINEWIDTH = 100
const MAX = 500
const debugObject = {} as DebugObject
debugObject.numSpheres = 30
debugObject.rotation = true
debugObject.normalise = false
debugObject.color = true
debugObject.hide = false

const gui = new GUI(
  {
    width: 300,
    title: 'UI',
  },
)
const folder = gui.addFolder('Parameters')
folder.add(debugObject, 'numSpheres', 0, MAX, 1).onChange(() => { renderLoop() })
folder.add(debugObject, 'rotation').onChange(() => { renderLoop() })
folder.add(debugObject, 'normalise').onChange(() => { renderLoop() })
folder.add(debugObject, 'color').onChange(() => { renderLoop() })
folder.add(debugObject, 'hide').onChange(() => { renderLoop() })

window.addEventListener('keydown', (event) => {
  if (event.key == 'h')
    gui.show(gui._hidden)
})


const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const axesHelper = new THREE.AxesHelper(18)
const axesHelperMaterial = axesHelper.material as THREE.LineBasicMaterial
axesHelperMaterial.linewidth = LINEWIDTH
axesHelper.position.set(-8, -8, -8)
scene.add(axesHelper)

const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32)

const xLineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: LINEWIDTH })
const xLinePoints = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(1, 0, 0),
]
const xLineGeometry = new THREE.BufferGeometry().setFromPoints(xLinePoints)

const yLineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: LINEWIDTH })
const yLinePoints = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, 1, 0),
]
const yLineGeometry = new THREE.BufferGeometry().setFromPoints(yLinePoints)

const zLineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: LINEWIDTH })
const zLinePoints = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, 0, 1),
]
const zLineGeometry = new THREE.BufferGeometry().setFromPoints(zLinePoints)

const xVector = new THREE.Vector3(1, 0, 0);

function colorFromVector(vector: THREE.Vector3): THREE.Color {
  function convertToColor(num: number): number {
    if (debugObject.normalise) {
      num = (num + 1) / 2
    }
    else {
      num = Math.abs(num)
    }
    return num
  }
  return new THREE.Color(convertToColor(vector.getComponent(0)), convertToColor(vector.getComponent(1)), convertToColor(vector.getComponent(2)))
}

interface Component {
  position: THREE.Vector3
  rotation: THREE.Matrix4
}

function generateRandomComponents(): Component[] {
  const output: Component[] = []
  for (let i = 0; i < MAX; i++) {
    const randomRotationMatrix = new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(seededRandom(), seededRandom(), seededRandom()).normalize(),
      seededRandom() * Math.PI * 2
    )

    const position = {
      x: (seededRandom() - 0.5) * 10,
      y: (seededRandom() - 0.5) * 10,
      z: (seededRandom() - 0.5) * 10
    }

    const rotation = randomRotationMatrix
    output.push({ position: new THREE.Vector3(position.x, position.y, position.z), rotation: rotation })
  }
  return output
}

const components = generateRandomComponents()

function renderLoop() {
  const toRemove = []
  for (let j = 0; j < scene.children.length; j++) {
    if (scene.children[j].type === 'Mesh' || scene.children[j].type === 'Line') {
      toRemove.push(scene.children[j])
    }
  }
  for (let j = 0; j < toRemove.length; j++) {
    scene.remove(toRemove[j])
  }
  for (let i = 0; i < debugObject.numSpheres; i++) {
    const component = components[i]
    const randomRotationMatrix = component.rotation
    const position = component.position

    let sphereMaterial;
    if (debugObject.color) {
      const rotatedXVector = xVector.clone().applyMatrix4(randomRotationMatrix)
      const rotationColor = colorFromVector(rotatedXVector)
      sphereMaterial = new THREE.LineBasicMaterial({ color: rotationColor })
    }
    else {
      sphereMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff })
    }

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    sphere.position.set(position.x, position.y, position.z)
    scene.add(sphere)

    if (debugObject.hide) {
      continue
    }
    const xline = new THREE.Line(xLineGeometry, xLineMaterial)
    xline.position.set(sphere.position.getComponent(0), sphere.position.getComponent(1), sphere.position.getComponent(2))
    if (debugObject.rotation) {
      xline.setRotationFromMatrix(randomRotationMatrix)
    }
    scene.add(xline)

    const yline = new THREE.Line(yLineGeometry, yLineMaterial)
    yline.position.set(sphere.position.getComponent(0), sphere.position.getComponent(1), sphere.position.getComponent(2))
    if (debugObject.rotation) {
      yline.setRotationFromMatrix(randomRotationMatrix)
    }
    scene.add(yline)

    const zline = new THREE.Line(zLineGeometry, zLineMaterial)
    zline.position.set(sphere.position.getComponent(0), sphere.position.getComponent(1), sphere.position.getComponent(2))
    if (debugObject.rotation) {
      zline.setRotationFromMatrix(randomRotationMatrix)
    }
    scene.add(zline)
  }
}

renderer.setClearColor(0xffffff, 1)
renderLoop()
const tick = () => {
  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()