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
  
## Using react-three-fiber

### Creating a New Project

```bash
npm create vite@latest app # React, typescript-SWC
cd app
npm install
npm run dev
```

### Adding a canvas object to the app.tsx file

```tsx
import { Canvas } from '@react-three/fiber';

function App () {
  return (
    <Canvas>
      <...>
    </Canvas>
  );
}
```

### Adding a mesh object to the canvas

```tsx
import { Canvas } from '@react-three/fiber';

function App () {
  return (
    <Canvas>
      <mesh>
        <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
        <meshBasicMaterial attach="material" color="hotpink" />
      </mesh>
    </Canvas>
  );
}

export default App;
```

### Minimal setup

1. Create a new Vite project with React and TypeScript.
2. Delete everything from src, except for the `vite-env.d.ts` file.
3. Create a new file called `app.tsx` in the src folder.
4. Add the following code to the `app.tsx` file:

    ```tsx
    import { Canvas } from '@react-three/fiber';

    function App () {
      return (
        <Canvas>
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial attach="material" color="hotpink" />
          </mesh>
        </Canvas>
      );
    }
    export default App;
    ```

5. Move the `index.html` file to the `src` folder. Populate it with the following code:

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>First React Three Fiber Application</title>
    </head>
    <body>
        <div id="root"></div>
        <script type="module" src="./index.tsx"></script></body>
    </html>
    ```

6. Create a `styles.css` file in the `src` folder. Populate it as so:

    ```css
    * {
      box-sizing: border-box;
    }

    html,
    body,
    #root {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
    }

    body {
      background: #f0f0f0;
    }
    ```

7. Create a `index.tsx` file in the `src` folder. Populate it with the following code:

    ```tsx
    import "./styles.css";
    import { createRoot } from "react-dom/client";
    import App from "./App";

    createRoot(document.getElementById("root")!).render(<App />);
    ```

8. Set the default vite config like so:

    ```typescript
    import react from '@vitejs/plugin-react-swc'
    import { transformWithEsbuild } from 'vite'
    import restart from 'vite-plugin-restart'

    export default {
        root: 'src/',
        publicDir: '../public/',
        plugins:
        [
            // Restart server on static/public file change
            restart({ restart: [ '../public/**', ] }),

            // React support
            react(),

            // .js file support as if it was JSX
            {
                name: 'load+transform-js-files-as-jsx',
                async transform(code, id)
                {
                    if (!id.match(/src\/.*\.js$/))
                        return null

                    return transformWithEsbuild(code, id, {
                        loader: 'jsx',
                        jsx: 'automatic',
                    });
                },
            },
        ],
        server:
        {
            host: true, // Open to local network and display URL
            open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env) // Open if it's not a CodeSandbox
        },
        build:
        {
            outDir: '../dist', // Output in the dist/ folder
            emptyOutDir: true, // Empty the folder first
            sourcemap: true // Add sourcemap
        },
    }
    ```

    Also install the following packages:

    ```bash
    npm install --save-dev vite-plugin-restart
    npm install @react-three/fiber
    npm i --save-dev @types/node
    ```

9. Optionally, it can be a you can customise the canvas. That would be something like (not gl params here are actually the default):

    ```tsx
    <Canvas
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
          }}
          camera={{
            fov: 45,
            near: 0.1,
            far: 200,
            position: [3, 2, 6],
          }}
        >
    ```

10. To get going quickly, another good idea are to add to objects to a `Stage` in drei.
11. If you want, drei offers a number of background images called `Environment` that can be used to light the scene. See https://github.com/pmndrs/drei/blob/master/src/helpers/environment-assets.ts for a list of available presets.

    ```tsx
    import { Environment, Stage } from '@react-three/drei';

    function App () {
      return (
        <Canvas>
          <ambientLight intensity={0.3} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <Stage>
            <Environment background preset="sunset" />
          </Stage>
        </Canvas>
      );
    }
    ```

12. Leva is a possible debug UI to use along with three js react. But using the react dev tools might be lower lift.
13. Monitoring in react three fiber is good with [r3f-perf](https://github.com/utsuboco/r3f-perf): `npm install --save-dev r3f-perf`.
14. Look at gltf to react three fiber https://github.com/pmndrs/gltfjsx. useGLTF is a hook that can be used to load gltf files. useAnimations is a hook that can be used to animate gltf files.

### Drei

[Drei](https://github.com/pmndrs/drei) is a collection of useful helpers and abstractions for react-three-fiber.
This is where you can find prebuilt components for Three JS - which speeds up the development process.

```bash
npm install @react-three/drei
```

See components at [Drei](https://drei.pmnd.rs/).

## Creating a New Project

```bash
npm create vite@latest my-app-name -- --template vanilla-ts
cd my-app-name
npm install --save three
npm install --save-dev @types/three
npm install --save lil-gui
npm install
npx vite
```

### Option 1: Use Three JS with Vite

1. Create a new Vite project with `npm create vite@latest`, and select a TypeScript project (vanilla).
2. Add `three` to the dependencies in `package.json` (`npm install --save three`).
3. Add `@types/three` to the dev dependencies in `package.json` (`npm install --save-dev @types/three`).
4. Run `npm install` to install the dependencies.
5. Add a canvas to the HTML file in the body (e.g., `<canvas class="webgl"></canvas>`).

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
- You can make a blank npm project by using `npm init -y`.
- `tailwind-css` is a utility-first CSS framework. It can be used to create responsive designs quickly.
- Troika is a library for creating 3D text in Three JS (https://github.com/protectwise/troika/tree/main/packages/troika-three-text). It can be used to create 3D text with custom fonts and styles.

## Texture Compression and Creation

- Compress textures using [TinyPNG](https://tinypng.com/), [Squoosh](https://squoosh.app/), or Basis.
- Find textures at Poliigon, 3D Textures, Arroway Textures, and Texture Haven.
- Create your own textures using Blender, Substance Painter, Quixel Mixer, Substance Designer, or Photoshop.
- Find or create Matcaps at [Nidorx's GitHub](https://github.com/nidorx/matcaps), [Matcap Studio](https://kchapelier.com/matcap-studio/), or with Blender.

## Finding Models

- Find models at Sketchfab, TurboSquid, CGTrader, and Free3D.
- For pmdrs specific models, use https://market.pmnd.rs/, details at https://github.com/pmndrs/market.
- Sample gltf models can be found at https://threejs.org/examples/#webgl_loader_gltf or https://github.com/KhronosGroup/glTF-Sample-Models.
- Kenny has a number of free models at https://kenney.nl/assets?q=3d. These are usually low poly models.

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

## Shadow issues

If you run into issues with shadows, on very round objects, try adjusting the shadow bias. This is performed by modifying the light object.
