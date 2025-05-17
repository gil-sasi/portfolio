export function drawSky(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  cameraX: number,
  cameraY: number,
  stars: { x: number; y: number; r: number }[],
  moonImage: HTMLImageElement
) {
  ctx.fillStyle = "#050510";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const starOffsetX = cameraX * 0.2;
  const moonOffsetX = cameraX * 0.05;

  for (const star of stars) {
    const screenX = star.x - starOffsetX;
    if (screenX >= 0 && screenX <= canvas.width) {
      ctx.beginPath();
      ctx.arc(screenX, star.y, star.r, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.shadowColor = "white";
      ctx.shadowBlur = 8 + Math.random() * 6;
      ctx.fill();
      ctx.closePath();
    }
  }

  ctx.shadowBlur = 0;

  const moonX = canvas.width - 180 - moonOffsetX;
  const moonY = 100 - cameraY * 0.05;
  const moonSize = 80;

  ctx.save();
  ctx.shadowColor = "#fdf6e3";
  ctx.shadowBlur = 60;
  ctx.drawImage(moonImage, moonX, moonY, moonSize, moonSize);
  ctx.restore();
}
