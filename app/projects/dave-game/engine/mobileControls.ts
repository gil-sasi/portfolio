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

    btn.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        keys[key] = true;
      },
      { passive: false }
    );

    btn.addEventListener(
      "touchend",
      (e) => {
        e.preventDefault();
        keys[key] = false;
      },
      { passive: false }
    );

    // Optional desktop mouse events for testing
    btn.addEventListener("mousedown", () => (keys[key] = true));
    btn.addEventListener("mouseup", () => (keys[key] = false));
    btn.addEventListener("mouseleave", () => (keys[key] = false));
  });
}
