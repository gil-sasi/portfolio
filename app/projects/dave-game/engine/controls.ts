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

    keys[e.key] = true;

    if (e.key === " ") onJump();
    if (e.key === "q" || e.key === "Q") toggleDebug();
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
