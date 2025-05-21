export function enableMobileControls(keys: Record<string, boolean>) {
  const map: Record<string, string | string[]> = {
    left: "ArrowLeft",
    right: "ArrowRight",
    jump: ["ArrowUp", "Space"], 
    shoot: "Control",
  };

  Object.entries(map).forEach(([id, keyOrKeys]) => {
    const btn = document.getElementById(id);
    if (!btn) {
      console.warn(`⚠️ Button #${id} not found in DOM`);
      return;
    }

    const keysArray = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];

    const setKeys = (value: boolean) => {
      keysArray.forEach((key) => {
        keys[key] = value;
        console.log(`${value ? "🟢" : "🔴"} ${id.toUpperCase()} → keys["${key}"] = ${value}`);
      });
    };

    btn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      setKeys(true);
    }, { passive: false });

    btn.addEventListener("touchend", (e) => {
      e.preventDefault();
      setKeys(false);
    }, { passive: false });

    // Optional desktop mouse events for testing
    btn.addEventListener("mousedown", () => setKeys(true));
    btn.addEventListener("mouseup", () => setKeys(false));
    btn.addEventListener("mouseleave", () => setKeys(false));
  });
}