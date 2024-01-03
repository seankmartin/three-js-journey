import { SceneInfo } from "./scene";
import { createShaderProgram } from "../utils/shader-utils";

class SimpleScene implements SceneInfo {
  gl: WebGL2RenderingContext;
  shaderProgram: WebGLProgram | null = null;
  drawScene: (gl: WebGL2RenderingContext, ...args: any[]) => void = () => {};

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.shaderProgram = createShaderProgram(
      this.gl,
      "vs_trivial.glsl",
      "fs_trivial.glsl"
    );
    this.drawScene = (gl) => {
        // Clear the canvas before we start drawing on it.
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Setup the correct gl state
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
    };
  }

}
