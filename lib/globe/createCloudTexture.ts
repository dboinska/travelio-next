import { CanvasTexture, RepeatWrapping } from "three";

/** Procedural equirectangular cloud map — no external asset required. */
export function createProceduralCloudTexture(): CanvasTexture {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return new CanvasTexture(canvas);
  }

  ctx.clearRect(0, 0, width, height);

  const blobs = 140;
  for (let i = 0; i < blobs; i++) {
    const x =
      (Math.sin(i * 12.9898) * 43758.5453 -
        Math.floor(Math.sin(i * 12.9898) * 43758.5453)) *
      width;
    const y =
      (Math.sin(i * 78.233) * 43758.5453 -
        Math.floor(Math.sin(i * 78.233) * 43758.5453)) *
      height;
    const radius = 28 + (i % 7) * 18;
    const alpha = 0.08 + (i % 5) * 0.04;

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(255,255,255,${alpha})`);
    gradient.addColorStop(0.55, `rgba(255,255,255,${alpha * 0.45})`);
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  return texture;
}
