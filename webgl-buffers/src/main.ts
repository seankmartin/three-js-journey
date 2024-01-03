import { setupCanvas } from "./utils/gl-utils";
import { initShaderProgram } from "./utils/shader-utils";

function main() {
    const { canvas, gl } = setupCanvas();


    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (!shaderProgram) {
        throw new Error("Unable to initialize shader program");
    }

    const programInfo : ShaderProgramInfo = {
        program: shaderProgram,
        attribLocations: {
          vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
          textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
        },
        uniformLocations: {
          projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix")!,
          modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix")!,
          uSampler: gl.getUniformLocation(shaderProgram, "uSampler")!,
        },
      };
    
    const buffers = initBuffers(gl);
    // Load texture
    const texture = loadTexture(gl, "cubetexture.png");
    // Flip image pixels into the bottom-to-top order that WebGL expects.
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    let then = 0;
    function render(now: number) {
        now *= 0.001; // convert to seconds
        deltaTime = now - then;
        then = now;
        
        drawScene(gl!, programInfo, buffers, texture, cubeRotation);
        cubeRotation += deltaTime;
        cubeRotation %= 2 * Math.PI;

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl');

// Create two framebuffers
const framebuffer1 = gl.createFramebuffer();
const framebuffer2 = gl.createFramebuffer();

// Set up the first framebuffer
gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer1);
// ... configure framebuffer1 attachments and render to it ...


// Set up the second framebuffer
gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer2);
// ... configure framebuffer2 attachments and render to it ...

// Set up the main framebuffer
gl.bindFramebuffer(gl.FRAMEBUFFER, null);

// Clear the canvas
gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

// Set up the viewport for the top half of the screen
gl.viewport(0, canvas.height / 2, canvas.width, canvas.height / 2);
// Bind the texture from framebuffer1 and render it

// Set up the viewport for the bottom half of the screen
gl.viewport(0, 0, canvas.width, canvas.height / 2);
// Bind the texture from framebuffer2 and render it
