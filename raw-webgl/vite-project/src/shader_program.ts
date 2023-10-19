export interface ShaderProgramInfo {
    program: WebGLProgram;
    attribLocations: {
        vertexPosition: number;
        textureCoord: number;
    };
    uniformLocations: {
        projectionMatrix: WebGLUniformLocation;
        modelViewMatrix: WebGLUniformLocation;
        uSampler: WebGLUniformLocation;
    };
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
export function initShaderProgram(gl: WebGL2RenderingContext, vsSource: string, fsSource: string) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    if (!vertexShader) {
        throw new Error("Unable to create vertex shader");
    }
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!fragmentShader) {
        throw new Error("Unable to create fragment shader");
    }

    // Create the shader program

    const shaderProgram = gl.createProgram();
    if (!shaderProgram) {
        throw new Error("Unable to create shader program");
    }
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert(
            `Unable to initialize the shader program: ${gl.getProgramInfoLog(
                shaderProgram,
            )}`,
        );
        return null;
    }

    return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl: WebGL2RenderingContext, type: number, source: string) {
    const shader = gl.createShader(type);
    if (!shader) {
        throw new Error(`Unable to create shader of type ${type}`);
    }

    // Send the source to the shader object

    gl.shaderSource(shader, source);

    // Compile the shader program

    gl.compileShader(shader);

    // See if it compiled successfully

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(
            `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`,
        );
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}