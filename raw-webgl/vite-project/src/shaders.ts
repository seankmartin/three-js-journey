export const vsSource = `
  attribute vec3 aVertexPosition;
  attribute vec2 aTextureCoord;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying highp vec2 vTextureCoord;

  void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
    vTextureCoord = aTextureCoord;
  }
`;

export const fsSource = `
  varying highp vec2 vTextureCoord;

  uniform sampler2D uSampler;

  void main(void) {
    mediump float color = gl_FrontFacing ? 1.0 : 0.0;
    // gl_FragColor = vec4(1.0, color, color, 1.0);
    gl_FragColor = texture2D(uSampler, vTextureCoord);
  }
`;
