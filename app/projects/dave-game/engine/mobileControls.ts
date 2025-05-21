export function enableMobileControls(keys: Record<string, boolean>) {
  const map = {
    left: "ArrowLeft",
    right: "ArrowRight",
    jump: " ",
    shoot: "Control",
  };

  Object.keys(map).forEach((id) => {
    const btn = document.getElementById(id);
    if (!btn) {
      console.warn(`⚠️ Button #${id} not found in DOM`);
      return;
    }

    const key = map[id as keyof typeof map];

    btn.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        keys[key] = true;
        console.log(`🟢 TOUCH START: ${id} → keys["${key}"] = true`);
      },
      { passive: false }
    );

    btn.addEventListener(
      "touchend",
      (e) => {
        e.preventDefault();
        keys[key] = false;
        console.log(`🔴 TOUCH END: ${id} → keys["${key}"] = false`);
      },
      { passive: false }
    );

    // Optional desktop mouse events for testing
    btn.addEventListener("mousedown", () => {
      keys[key] = true;
      console.log(`🖱️ MOUSE DOWN: ${id} → keys["${key}"] = true`);
    });

    btn.addEventListener("mouseup", () => {
      keys[key] = false;
      console.log(`🖱️ MOUSE UP: ${id} → keys["${key}"] = false`);
    });

    btn.addEventListener("mouseleave", () => {
      keys[key] = false;
      console.log(`🚪 MOUSE LEAVE: ${id} → keys["${key}"] = false`);
    });
  });
}
