export const potionSprites: Record<string, HTMLImageElement[]> = {
  red: [],
  yellow: [],
};

function loadPotionSprites(color: string, count: number): HTMLImageElement[] {
  const frames: HTMLImageElement[] = [];

  if (typeof window !== "undefined") {
    for (let i = 1; i <= count; i++) {
      const img = new Image();
      img.src = `/assets/images/potions/${color}_potion/${i}.png`;
      frames.push(img);
    }
  }
  return frames;
}

// Run on init
potionSprites.red = loadPotionSprites("red", 1);
potionSprites.yellow = loadPotionSprites("yellow", 1);
