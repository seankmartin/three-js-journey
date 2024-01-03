import { setupCanvas } from "./utils/gl-utils";
import { SimpleScene } from "./scenes/simple-scene";

main();

function main() {
    const { canvas, gl } = setupCanvas();
    const scene = new SimpleScene(gl);
    gl.viewport(0, canvas.height / 2, canvas.width, canvas.height / 2);
    scene.drawScene(gl);      
}
