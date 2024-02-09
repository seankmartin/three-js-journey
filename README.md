# Three JS Journey

This project follows the process outlined in [Three JS Journey](https://threejs-journey.com).

## Table of Contents
- [Three JS Journey](#three-js-journey)
  - [Table of Contents](#table-of-contents)
  - [Creating a New Project](#creating-a-new-project)
    - [Option 1: Use Three JS with Vite](#option-1-use-three-js-with-vite)
    - [Option 2: Use React with React-Three-Fibre](#option-2-use-react-with-react-three-fibre)
  - [Key Concepts](#key-concepts)
  - [Texture Compression and Creation](#texture-compression-and-creation)
  - [Hosting](#hosting)
    - [Hosting on Vercel](#hosting-on-vercel)

## Creating a New Project

### Option 1: Use Three JS with Vite
1. Create a new Vite project with `npm create vite@latest`, and select a TypeScript project (vanilla).
2. Add `three` to the dependencies in `package.json`.
3. Add `@types/three` to the dev dependencies in `package.json`.
4. Run `npm install` to install the dependencies.
5. Add a canvas to the HTML file (e.g., `<canvas class="webgl"></canvas>`).

To run the project, use `npx vite`.

### Option 2: Use React with React-Three-Fibre
1. Create a new Vite project with `npm create vite@latest`, and select a TypeScript project with React.
2. Add `react-three-fibre` to the dependencies in `package.json`.
3. Add `@types/three` to the dev dependencies in `package.json`.
4. Run `npm install` to install the dependencies.

## Key Concepts
- Three JS is a library for creating 3D scenes in the browser.
- Vite is used to create a dev server.
- NVM can be used to switch Node.js versions.
- React Three Fibre allows the use of Three JS with React.
- Poimandres is the organization behind React Three Fibre.
- DREI provides prebuilt components for Three JS.
- Devices can have a high pixel ratio. Use `window.devicePixelRatio` to get the device's pixel ratio. This is important for ensuring the canvas is the correct size for the device. A pixel ratio of 2 is common and can be a good default.
- Use `window.addEventListener('resize', () => {})` and `window.addEventListener('orientationchange', () => {})` to listen for window resize and device orientation changes, respectively.
- To create a debug menu in Three JS, use `dat.gui` or the newer `lil-gui`.
- GSAP is a library for animations in Three JS. To animate meshes, you can use the `requestAnimationFrame` function or GSAP. GSAP is recommended for more complex animations.
- Cannon JS is a physics library for Three JS. It can be used to create realistic physics simulations. Cannon-es is a more maintained version of Cannon JS. However, AmmoJS is recommended for physics simulations in Three JS.
- To keep shaders in a separate file, use the `glslify` package. This allows you to write shaders in a separate file and import them into your JavaScript files. Alternatively, you can use the `glsl` package to write shaders in JavaScript files. Becaause we usually use `vite` to create a project, we can use the `vite-plugin-glsl` to import GLSL files directly into our JavaScript files.

## Texture Compression and Creation
- Compress textures using [TinyPNG](https://tinypng.com/), [Squoosh](https://squoosh.app/), or Basis.
- Find textures at Poliigon, 3D Textures, Arroway Textures, and Texture Haven.
- Create your own textures using Blender, Substance Painter, Quixel Mixer, Substance Designer, or Photoshop.
- Find or create Matcaps at [Nidorx's GitHub](https://github.com/nidorx/matcaps), [Matcap Studio](https://kchapelier.com/matcap-studio/), or with Blender.

## Hosting
- Host your project on [Vercel](https://vercel.com/) for free for non-commercial projects.
- Netlify and GitHub Pages are other options for hosting.

### Hosting on Vercel

1. Install the Vercel CLI with `npm install -g vercel`. Or, install it locally with `npm install --save-dev vercel`.
2. Run `vercel login` to log in to Vercel.
3. Add a new deploy command to `package.json`:
```json
"scripts": {
  "deploy": "vercel --prod"
}
```
4. Run `npm run deploy` to deploy the project.