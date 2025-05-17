export function enableMobileControls(keys: Record<string, boolean>) {
  const map = {
    left: "ArrowLeft",
    right: "ArrowRight",
    jump: "Space",
    shoot: "Control",
  };

  Object.keys(map).forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const key = map[id as keyof typeof map];

    const press = (e: Event) => {
      e.preventDefault();
      keys[key] = true;
    };
    const release = (e: Event) => {
      e.preventDefault();
      keys[key] = false;
    };

    el.addEventListener("touchstart", press, { passive: false });
    el.addEventListener("touchend", release, { passive: false });

    el.addEventListener("mousedown", press);
    el.addEventListener("mouseup", release);
    el.addEventListener("mouseleave", release);
  });
}
