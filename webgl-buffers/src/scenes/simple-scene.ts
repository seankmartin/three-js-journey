import { SceneInfo } from "./scene";
import { createShaderProgram } from "../utils/shader-utils";
import { createCube } from "../components/objects/cube";
import { createPerspectiveMatrix } from "../components/camera";
import { mat4 } from "gl-matrix";
import { rotate, scale, translate } from "../components/transformations";
import { setPositionAttribute } from "../utils/gl-utils";
import { frag, vert } from "../components/shaders/trivial";

export class SimpleScene implements SceneInfo {
  gl: WebGL2RenderingContext;
  shaderProgram: WebGLProgram | null = null;
  objects: Record<string, any> = {};
  locations: Record<string, any> = {};
  drawScene: (gl: WebGL2RenderingContext, ...args: any[]) => void = () => {};

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.shaderProgram = createShaderProgram(this.gl, vert, frag);
    if (!this.shaderProgram) {
      throw new Error("Unable to create shader program");
    }
    this.objects.cube = createCube(gl);
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

    this.drawScene = (gl) => {
      // Clear the canvas before we start drawing on it.
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clearDepth(1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // Setup the correct gl state
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);

      const perspectiveMatrix = createPerspectiveMatrix(gl);
      const modelViewMatrix = mat4.create();
      translate(modelViewMatrix, 0, 0, -6);
      rotate(modelViewMatrix, 10, [1, 1, 1]);
      scale(modelViewMatrix, 0.5, 0.5, 0.5);

      setPositionAttribute(
        gl,
        this.objects.cube.positions,
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
      gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_SHORT, offset);
    };
  }
}
