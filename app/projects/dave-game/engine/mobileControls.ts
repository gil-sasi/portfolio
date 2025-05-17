export function enableMobileControls(keys: Record<string, boolean>) {
  const map = {
    left: "ArrowLeft",
    right: "ArrowRight",
    jump: "Space",
    shoot: "Control",
  };

  Object.keys(map).forEach((id) => {
    const btn = document.getElementById(id);
    if (!btn) return;

    const key = map[id as keyof typeof map];

    btn.addEventListener("touchstart", () => {
      keys[key] = true;
    });

    btn.addEventListener("touchend", () => {
      keys[key] = false;
    });
  });
}