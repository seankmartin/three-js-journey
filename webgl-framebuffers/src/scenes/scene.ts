export interface SceneInfo {
    shaderProgram: WebGLProgram | null;
    drawScene: (gl: WebGL2RenderingContext, ...args: any[]) => void;
}