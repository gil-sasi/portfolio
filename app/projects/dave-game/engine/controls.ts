export function setupControls(
  keys: Record<string, boolean>,
  onJump: () => void,
  toggleDebug: () => void
): () => void {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (
      [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        " ",
        "Control",
        "q",
        "Q",
      ].includes(e.key)
    ) {
      e.preventDefault();
    }

    // Prevent jump spam by triggering jump only once per press
    if (e.key === " " && !keys[" "]) {
      onJump(); // let Player class decide if it should jump
    }

    // Toggle debug once per press
    if ((e.key === "q" || e.key === "Q") && !keys[e.key]) {
      toggleDebug();
    }

    keys[e.key] = true;
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    keys[e.key] = false;
  };

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
  };
}
