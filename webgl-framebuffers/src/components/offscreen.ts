import { createCanvasTexture } from "./texture";

export class FrameBuffer {
    gl: WebGL2RenderingContext;
    frameBuffer: WebGLFramebuffer | null;
    drawBuffers: number[];
    texture1: WebGLTexture | null;
    texture2: WebGLTexture | null;

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;

        const frameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        const texture1 = createCanvasTexture(gl);
        const texture2 = createCanvasTexture(gl);
    
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            gl.COLOR_ATTACHMENT0,
            gl.TEXTURE_2D,
            texture1,
            0
        );
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            gl.COLOR_ATTACHMENT1,
            gl.TEXTURE_2D,
            texture2,
            0
        );
        
        const drawBuffers = [gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1];
        
        this.frameBuffer = frameBuffer;
        this.drawBuffers = drawBuffers;
        this.texture1 = texture1;
        this.texture2 = texture2;

        const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if (status !== gl.FRAMEBUFFER_COMPLETE) {
            console.error("Unable to create frame buffer");
            return;
        }
    }

    activate() {
        const {gl, frameBuffer, drawBuffers} = this;
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        gl.drawBuffers(drawBuffers);
    }

    deactivate() {
        const {gl} = this;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
}
