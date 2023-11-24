# Three JS journey

Following the process of https://threejs-journey.com

## Most important things to remember

1. Three JS is a library that allows us to create 3D scenes in the browser
2. Vite is used to create a dev server
3. NVM can be used to change the version of node that you are using
4. React Three Fibre is a library that allows us to use Three JS with React
5. Poimandres is an organisation that built react three fibre.
6. DREI can be used to find prebuilt components for three js
7. To create a new react app, you can run `npm create vite@latest` and then select react as the template
8. [GSAP](https://gsap.com/) is a library that can be used to animate things in three js.
9. Devices can have a high pixel ratio, so we can use `window.devicePixelRatio` to get the pixel ratio of the device.
   1. This can be used to make sure that the canvas is the correct size for the device.
   2. We can use `window.addEventListener('resize', () => {})` to listen for when the window is resized.
   3. We can use `window.addEventListener('orientationchange', () => {})` to listen for when the orientation of the device changes.
   4. This happens a lot on mobile devices.
   5. However, a pixel ratio of 2 is the most common - and can be a good default.
10. To create a debug menu in three js, we can use `dat.gui`, or the newer lil-gui.
11. To compress textures, we can use [TinyPNG](https://tinypng.com/), or better yet, [Squoosh](https://squoosh.app/), or basis.
12. Some examples to find textures are at poliigon.com, 3dtextures.me, arroway-textures.ch, and texturehaven.com.
13. To create your own texture, you could use blender, or substance painter, or quixel mixer, or substance designer, or photoshop.
14. Matcaps at https://github.com/nidorx/matcaps or make them at matcap-studio kchapelier.com/matcap-studio/, or with blender by rendering a sphere with a material and putting it in the middle of the scene in a square image.
15. You can host your project on vercel for free for non-commercial projects.
