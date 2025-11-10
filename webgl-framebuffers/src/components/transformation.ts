import { mat4 } from "gl-matrix";
export function translate(
  matrix: mat4,
  x: number,
  y: number,
  z: number
) {
  mat4.translate(matrix, matrix, [x, y, z]);
}

export function rotate(
  matrix: mat4,
  angle: number,
  axis: [number, number, number]
) {
  mat4.rotate(matrix, matrix, angle, axis);
}

export function scale(
  matrix: mat4,
  x: number,
  y: number,
  z: number
) {
  mat4.scale(matrix, matrix, [x, y, z]);
}