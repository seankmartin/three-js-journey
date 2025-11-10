export const frag = `#version 300 es
precision mediump float;

out vec4 fragColor;
void main() {
    fragColor = vec4(1.0, 1.0, 0.0, 1.0);
}
`;

export const vert = `#version 300 es
in vec3 aVertexPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}
`;