import { SceneInfo } from "./scene";
import { createShaderProgram } from "../utils/shader-utils";
import { createCube } from "../components/objects/cube";
import { createPerspectiveMatrix } from "../components/camera";
import { mat4 } from "gl-matrix";
import { rotate, scale, translate } from "../components/transformation";
import { setPositionAttribute } from "../utils/gl-utils";
import { frag, vert } from "../components/shaders/trivial";
import { FrameBuffer } from "../components/offscreen";
import { createScreenBuffer, activateTexture } from "../components/texture";
import { offscreenFrag, combineVert, combineFrag } from "../components/shaders/offscreen-shader";

export class SimpleScene implements SceneInfo {
  gl: WebGL2RenderingContext;
  shaderProgram: WebGLProgram | null = null;
  objects: Record<string, any> = {};
  locations: Record<string, any> = {};
  drawScene: (gl: WebGL2RenderingContext, ...args: any[]) => void = () => {};

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.shaderProgram = createShaderProgram(this.gl, vert, frag);
    const offscreenProgram = createShaderProgram(this.gl, vert, offscreenFrag);
    const combineProgram = createShaderProgram(this.gl, combineVert, combineFrag);
    if (!this.shaderProgram) {
      throw new Error("Unable to create shader program");
    }
    if (!offscreenProgram) {
      throw new Error("Unable to create shader program");
    }
    if (!combineProgram) {
      throw new Error("Unable to create shader program");
    }
    this.locations = {
      vertexPosition: gl.getAttribLocation(
        this.shaderProgram,
        "aVertexPosition"
      ),
      projectionMatrix: gl.getUniformLocation(
        this.shaderProgram,
        "uProjectionMatrix"
      ),
      modelViewMatrix: gl.getUniformLocation(
        this.shaderProgram,
        "uModelViewMatrix"
      ),
    };
    const offscreenLocations = {
      vertexPosition: gl.getAttribLocation(
        offscreenProgram,
        "aVertexPosition"
      ),
      projectionMatrix: gl.getUniformLocation(
        offscreenProgram,
        "uProjectionMatrix"
      ),
      modelViewMatrix: gl.getUniformLocation(
        offscreenProgram,
        "uModelViewMatrix"
      ),
    };
    const combineLocations = {
      UV: gl.getAttribLocation(
        combineProgram,
        "aUV"
      ),
      texture0: gl.getUniformLocation(
        combineProgram,
        "uTexture0"
      ),
      texture1: gl.getUniformLocation(
        combineProgram,
        "uTexture1"
      ),
    };
    this.objects.cube = createCube(gl);

    const perspectiveMatrix = createPerspectiveMatrix(gl);
    const modelViewMatrix = mat4.create();
    translate(modelViewMatrix, 0, 0, -6);
    rotate(modelViewMatrix, 1.1, [1, 1, 1]);
    scale(modelViewMatrix, 1.3, 1.5, 1.5);

    const frameBuffer = new FrameBuffer(gl);
    const screenBuffer = createScreenBuffer(gl);

    this.drawScene = (gl) => {
      // Clear the canvas before we start drawing on it.
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clearDepth(1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // Setup the correct gl state
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);

      setPositionAttribute(
        gl,
        this.objects.cube.position,
        this.locations.vertexPosition
      );
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.objects.cube.indices);

      gl.useProgram(this.shaderProgram);
      gl.uniformMatrix4fv(
        this.locations.projectionMatrix,
        false,
        perspectiveMatrix
      );
      gl.uniformMatrix4fv(
        this.locations.modelViewMatrix,
        false,
        modelViewMatrix
      );

      const offset = 0;
      const vertexCount = 36;
      
      // Draw to the offscreen buffers
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      const canvas = gl.canvas as HTMLCanvasElement;
      gl.useProgram(offscreenProgram);
      gl.uniformMatrix4fv(
        offscreenLocations.projectionMatrix,
        false,
        perspectiveMatrix
      );
      gl.uniformMatrix4fv(
        offscreenLocations.modelViewMatrix,
        false,
        modelViewMatrix
      );
      frameBuffer.activate();
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clearDepth(1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_SHORT, offset);

      // Draw to the top half of the screen
      gl.viewport(0, canvas.height / 2, canvas.width, canvas.height / 2);
      frameBuffer.deactivate();
      gl.useProgram(this.shaderProgram);
      gl.uniformMatrix4fv(
        this.locations.projectionMatrix,
        false,
        perspectiveMatrix
      );
      gl.uniformMatrix4fv(
        this.locations.modelViewMatrix,
        false,
        modelViewMatrix
      );
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clearDepth(1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_SHORT, offset);

      // Draw to the bottom half of the screen
      gl.viewport(0, 0, canvas.width, canvas.height / 2);
      gl.useProgram(combineProgram);
      activateTexture(gl, frameBuffer.texture1, combineProgram, 0);
      activateTexture(gl, frameBuffer.texture2, combineProgram, 1);
      gl.enableVertexAttribArray(combineLocations.UV);
      gl.bindBuffer(gl.ARRAY_BUFFER, screenBuffer);
      gl.vertexAttribPointer(combineLocations.UV, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    };
  }
}
