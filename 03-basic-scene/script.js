// Grab the dom element

const scene = new THREE.Scene()
const geometry = new THREE.BoxGeometry(1, 1, 1)
// Can also provide a hex value for color
// E.g. 0xff0000 for red
const material = new THREE.MeshBasicMaterial({ color: 'red' })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const sizes = {
    width: 800,
    height: 600
}
const aspect_ratio = sizes.width / sizes.height
const camera = new THREE.PerspectiveCamera(75, aspect_ratio, 0.1, 100)
camera.position.set(1.5, 0.5, 3)
scene.add(camera)

const canvas = document.querySelector('.webgl')
// NOTE in JS you can remove the canvas: canvas if the variable name is the same
const renderer = new THREE.WebGLRenderer({
    canvas
})
renderer.setSize(sizes.width, sizes.height)

renderer.render(scene, camera)
console.log(renderer)