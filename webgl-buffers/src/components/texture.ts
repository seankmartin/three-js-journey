export function createCanvasTexture(gl: WebGL2RenderingContext) {
    const canvas = gl.canvas as HTMLCanvasElement;
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      canvas.width,
      canvas.height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    return texture;
  }

export function createScreenBuffer(gl: WebGL2RenderingContext, xOffset: number, program: WebGLProgram, ) {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
        xOffset - 0.5, -1.0,
        xOffset + 0.5, -1.0,
        xOffset - 0.5, 1.0,
        xOffset + 0.5, 1.0,
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    const positionLocation = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);
    return positionBuffer;
}

export function activateTexture(gl: WebGL2RenderingContext, texture: WebGLTexture, program: WebGLProgram, index: number) {
    const textureLocation = gl.getUniformLocation(program, `uTexture${index}`);
    gl.uniform1i(textureLocation, index);
    gl.activeTexture(gl.TEXTURE0 + index);
    gl.bindTexture(gl.TEXTURE_2D, texture);
}