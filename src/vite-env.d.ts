/// <reference types="vite/client" />

type AspectRatio = {
  x: number,
  y: number
}

type Display = {
  size: number,
  ar: AspectRatio,
}

type Dimension = {
  width: number,
  height: number,
  diagonal: number,
  area: number,
  widthCm: number,
  heightCm: number,
  diagonalCm: number,
  areaSqcm: number,
}