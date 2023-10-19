import { initShaderProgram, ShaderProgramInfo} from "./shader_program";
import { fsSource, vsSource } from "./shaders";
import { drawScene } from "./draw-scene";
import { initBuffers } from "./init-buffers";

main();

let cubeRotation = 0.0;
let deltaTime = 0.0;

function main() {
    const canvas = document.querySelector("#glcanvas") as HTMLCanvasElement;
    // Initialize the GL context
    const gl = canvas.getContext("webgl2");

    // Only continue if WebGL is available and working
    if (gl === null) {
        alert(
            "Unable to initialize WebGL. Your browser or machine may not support it.",
        );
        throw new Error("WebGL not supported");
    }

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    if (!shaderProgram) {
        throw new Error("Unable to initialize shader program");
    }

    const programInfo : ShaderProgramInfo = {
        program: shaderProgram,
        attribLocations: {
          vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
          vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
        },
        uniformLocations: {
          projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix")!,
          modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix")!,
        },
      };
    
    const buffers = initBuffers(gl);

    let then = 0;
    function render(now: number) {
        now *= 0.001; // convert to seconds
        deltaTime = now - then;
        then = now;
        
        drawScene(gl!, programInfo, buffers, cubeRotation);
        cubeRotation += deltaTime;
        cubeRotation %= 2 * Math.PI;

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

}