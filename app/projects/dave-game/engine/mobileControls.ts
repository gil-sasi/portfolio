export function enableMobileControls(keys: Record<string, boolean>) {
  const map = {
    left: "ArrowLeft",
    right: "ArrowRight",
    jump: "Space",
    shoot: "Control",
  };

  Object.entries(map).forEach(([id, key]) => {
    const btn = document.getElementById(id);
    if (!btn) return;

    // Handle touch events
    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      keys[key] = true;
    };

    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      keys[key] = false;
    };

    // Handle mouse events (for testing on PC)
    const onMouseDown = () => (keys[key] = true);
    const onMouseUp = () => (keys[key] = false);
    const onMouseLeave = () => (keys[key] = false);

    btn.addEventListener("touchstart", onTouchStart, { passive: false });
    btn.addEventListener("touchend", onTouchEnd, { passive: false });

    btn.addEventListener("mousedown", onMouseDown);
    btn.addEventListener("mouseup", onMouseUp);
    btn.addEventListener("mouseleave", onMouseLeave);
  });
}
