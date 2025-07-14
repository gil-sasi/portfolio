import React from "react";
import { useTranslation } from "react-i18next";
import { BackgammonGameState } from "../types";

interface MoveHintsProps {
  gameState: BackgammonGameState;
  playerIndex: number | null;
  disabled: boolean;
}

const MoveHints: React.FC<MoveHintsProps> = ({
  gameState,
  playerIndex,
  disabled,
}) => {
  const { t } = useTranslation();

  // Don't show hints if disabled or not player's turn
  if (disabled || playerIndex === null) {
    return null;
  }

  // Get dice values that are still available
  const availableDice = gameState.dice.filter((die) => die > 0);

  // Different hint messages based on game state
  let hintMessage = "";
  let hintType: "info" | "success" | "warning" | "error" = "info";

  if (!gameState.rolled) {
    hintMessage =
      "🎲 " +
      t(
        "backgammon.hintRollDice",
        "Click the dice to roll and start your turn!"
      );
    hintType = "info";
  } else if (gameState.bar[playerIndex] > 0) {
    hintMessage =
      "⚠️ " +
      t("backgammon.hintBarPieces", "You must move pieces from the bar first!");
    hintType = "warning";
  } else if (availableDice.length > 0) {
    hintMessage = `✨ ${t(
      "backgammon.hintAvailableMoves",
      "You can move"
    )} ${availableDice.join(", ")} ${t("backgammon.hintSpaces", "spaces")}. ${t(
      "backgammon.hintSelectPiece",
      "Yellow highlights show pieces you can move!"
    )}`;
    hintType = "success";
  } else {
    hintMessage =
      "✅ " + t("backgammon.hintTurnComplete", "All dice used! Turn complete.");
    hintType = "success";
  }

  if (!hintMessage) return null;

  const bgColor = {
    info: "bg-blue-500",
    success: "bg-green-500",
    warning: "bg-orange-500",
    error: "bg-red-500",
  }[hintType];

  return (
    <div
      className={`${bgColor} text-white px-4 py-2 rounded-lg shadow-lg max-w-md text-center`}
    >
      <div className="text-sm font-medium">{hintMessage}</div>
      {gameState.rolled && availableDice.length > 0 && (
        <div className="text-xs mt-1 opacity-90">
          {t("backgammon.hintDiceValues", "Available dice")}:{" "}
          {availableDice.map((die) => `🎲${die}`).join(" ")}
        </div>
      )}
    </div>
  );
};

export default MoveHints;
