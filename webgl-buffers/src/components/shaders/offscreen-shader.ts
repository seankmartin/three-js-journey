export const offscreenFrag = `#version 300 es
precision mediump float;
layout(location=0) out vec4 fragColor0;
layout(location=1) out vec4 fragColor1;

void main() {
fragColor0 = vec4(1.0, 0.0, 0.0, 1.0);
fragColor1 = vec4(0.0, 0.0, 1.0, 1.0);
}
`;

export const combineFrag = `#version 300 es
precision mediump float;
uniform sampler2D uTexture0;
uniform sampler2D uTexture1;

out vec4 fragColor;

void main() {
    vec2 uv = gl_FragCoord.xy / vec2(800, 600);
    vec4 tex0 = texture(uTexture0, uv);
    vec4 tex1 = texture(uTexture1, uv);
    fragColor = tex0 + tex1;
}
`;