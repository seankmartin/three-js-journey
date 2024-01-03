import { setupCanvas } from "./utils/gl-utils";
import { SimpleScene } from "./scenes/simple-scene";

main();

function main() {
    const { gl } = setupCanvas();
    const scene = new SimpleScene(gl);
    scene.drawScene(gl);      
}
