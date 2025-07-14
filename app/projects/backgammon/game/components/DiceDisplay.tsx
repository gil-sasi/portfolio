import React from "react";
import { useTranslation } from "react-i18next";

interface DiceDisplayProps {
  dice: number[]; // Changed from [number, number] to number[] for doubles support
  onRollDice: () => void;
  canRoll?: boolean;
  playerIndex: number | null;
}

const DiceDisplay: React.FC<DiceDisplayProps> = ({
  dice,
  onRollDice,
  canRoll = false,
  playerIndex,
}) => {
  const { t } = useTranslation();

  // For display purposes, show first 2 dice values
  const displayDice = dice.length <= 2 ? dice : [dice[0], dice[0]];
  const normalizedDice = [...displayDice, 0, 0].slice(0, 2); // Always show 2 dice

  // Render dice dots based on value
  const renderDiceDots = (value: number) => {
    if (value === 0) return null; // No dots for used dice

    const dotPositions = {
      1: [[50, 50]],
      2: [
        [25, 25],
        [75, 75],
      ],
      3: [
        [25, 25],
        [50, 50],
        [75, 75],
      ],
      4: [
        [25, 25],
        [75, 25],
        [25, 75],
        [75, 75],
      ],
      5: [
        [25, 25],
        [75, 25],
        [50, 50],
        [25, 75],
        [75, 75],
      ],
      6: [
        [25, 25],
        [75, 25],
        [25, 50],
        [75, 50],
        [25, 75],
        [75, 75],
      ],
    };

    const dots = dotPositions[value as keyof typeof dotPositions] || [];

    return (
      <div className="relative w-full h-full">
        {dots.map(([x, y], index) => (
          <div
            key={index}
            className="absolute w-3 h-3 bg-gray-800 rounded-full shadow-inner"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: "translate(-50%, -50%)",
              boxShadow:
                "inset 0 1px 2px rgba(0, 0, 0, 0.8), 0 1px 1px rgba(255, 255, 255, 0.2)",
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Dice Container */}
      <div className="flex space-x-4">
        {normalizedDice.map((die, idx) => (
          <div
            key={idx}
            onClick={canRoll ? onRollDice : undefined}
            className={`relative w-20 h-20 rounded-2xl border-3 shadow-2xl flex items-center justify-center transition-all duration-300 ${
              die === 0
                ? "bg-gradient-to-br from-gray-300 to-gray-400 border-gray-500 opacity-50 scale-90"
                : canRoll
                ? "bg-gradient-to-br from-white via-gray-50 to-gray-100 border-gray-400 hover:scale-105 animate-bounce cursor-pointer"
                : "bg-gradient-to-br from-white via-gray-50 to-gray-100 border-gray-400 animate-pulse"
            }`}
            style={{
              boxShadow:
                die === 0
                  ? "0 4px 8px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.3)"
                  : "0 8px 25px rgba(0, 0, 0, 0.4), inset 0 3px 6px rgba(255, 255, 255, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.5)",
              background:
                die === 0
                  ? "linear-gradient(135deg, #d1d5db 0%, #9ca3af 50%, #6b7280 100%)"
                  : "linear-gradient(135deg, #ffffff 0%, #f9fafb 30%, #f3f4f6 70%, #e5e7eb 100%)",
            }}
          >
            {/* Inner beveled edge */}
            <div className="absolute inset-1 rounded-xl border border-gray-200 pointer-events-none opacity-60" />

            {/* Dice dots */}
            {renderDiceDots(die)}

            {/* Active dice glow effect */}
            {die > 0 && (
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/20 to-purple-400/20 animate-pulse pointer-events-none" />
            )}
          </div>
        ))}
      </div>

      {/* Moves remaining indicator for doubles */}
      {dice.length > 2 && (
        <div className="text-sm text-amber-300 font-medium">
          {t("backgammon.movesRemaining")}: {dice.filter((d) => d > 0).length}
        </div>
      )}

      {/* Status indicator */}
      <div className="flex items-center space-x-2">
        <div
          className={`w-3 h-3 rounded-full ${
            canRoll
              ? "bg-green-500 animate-pulse"
              : dice.some((d) => d > 0)
              ? "bg-blue-500"
              : "bg-gray-400"
          }`}
        />
        <span className="text-sm font-medium text-gray-300">
          {canRoll
            ? t("backgammon.clickToRoll", "Click dice to roll")
            : dice.some((d) => d > 0)
            ? t("backgammon.makeMove", "Make your move")
            : t("backgammon.waitingForOpponent", "Waiting for opponent")}
        </span>
      </div>
    </div>
  );
};

export default DiceDisplay;
