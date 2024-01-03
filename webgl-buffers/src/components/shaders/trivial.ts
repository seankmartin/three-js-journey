export const frag = `
void main() {
    gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
}
`;

export const vert = `
attribute vec3 aVertexPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}
`;