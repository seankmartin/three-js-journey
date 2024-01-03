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
