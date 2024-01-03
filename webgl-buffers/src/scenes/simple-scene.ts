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
import { offscreenFrag } from "../components/shaders/offscreen-shader";

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
    if (!this.shaderProgram) {
      throw new Error("Unable to create shader program");
    }
    if (!offscreenProgram) {
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
    this.objects.cube = createCube(gl);

    const perspectiveMatrix = createPerspectiveMatrix(gl);
    const modelViewMatrix = mat4.create();
    translate(modelViewMatrix, 0, 0, -6);
    rotate(modelViewMatrix, 1.1, [1, 1, 1]);
    scale(modelViewMatrix, 1.3, 1.5, 1.5);

    const frameBuffer = new FrameBuffer(gl);

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
      frameBuffer.activate();
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clearDepth(1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_SHORT, offset);

      frameBuffer.deactivate();
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clearDepth(1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_SHORT, offset);
    };
  }
}
