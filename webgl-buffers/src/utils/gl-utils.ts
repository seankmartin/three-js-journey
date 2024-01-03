export function setupCanvas() {
  const canvas = document.querySelector("#glcanvas") as HTMLCanvasElement;
  // Initialize the GL context
  const gl = canvas.getContext("webgl2");

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    throw new Error("WebGL not supported");
  }
  return { canvas, gl };
}

export function setPositionAttribute(gl: WebGL2RenderingContext, position: WebGLBuffer, vertexPosition: number) {
  const numComponents = 3; // pull out 2 values per iteration
  const type = gl.FLOAT; // the data in the buffer is 32bit floats
  const normalize = false; // don't normalize
  const stride = 0; // how many bytes to get from one set of values to the next
  // 0 = use type and numComponents above
  const offset = 0; // how many bytes inside the buffer to start from
  gl.bindBuffer(gl.ARRAY_BUFFER, position);
  gl.vertexAttribPointer(
      vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset,
  );
  gl.enableVertexAttribArray(vertexPosition);
}

// Tell WebGL how to pull out the colors from the color buffer
// into the vertexColor attribute.
export function setColorAttribute(gl: WebGL2RenderingContext, color: WebGLBuffer, vertexColor: number) {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, color);
    gl.vertexAttribPointer(
        vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset,
    );
    gl.enableVertexAttribArray(vertexColor);
}

// tell webgl how to pull out the texture coordinates from buffer
export function setTextureAttribute(gl: WebGL2RenderingContext, textureCoord: WebGLBuffer, textureCoordAttribute: number) {
  const num = 2; // every coordinate composed of 2 values
  const type = gl.FLOAT; // the data in the buffer is 32-bit float
  const normalize = false; // don't normalize
  const stride = 0; // how many bytes to get from one set to the next
  const offset = 0; // how many bytes inside the buffer to start from
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoord);
  gl.vertexAttribPointer(
    textureCoordAttribute,
    num,
    type,
    normalize,
    stride,
    offset,
  );
  gl.enableVertexAttribArray(textureCoordAttribute);
}