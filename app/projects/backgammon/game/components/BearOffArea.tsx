import React from "react";
import GamePiece from "./GamePiece";

interface BearOffAreaProps {
  bearOff: number[];
  side: "left" | "right";
  isValidDestination?: boolean;
  onPointerDown?: (e: React.PointerEvent) => void;
  onClick?: () => void;
  disabled?: boolean;
  playerIndex?: number | null;
  isMobile?: boolean;
}

const BearOffArea: React.FC<BearOffAreaProps> = ({
  bearOff,
  side,
  isValidDestination = false,
  onPointerDown,
  onClick,
  disabled = false,
  playerIndex,
  isMobile = false,
}) => {
  const sideStyle = side === "left" ? { left: 0 } : { right: 0 };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled || !onPointerDown) return;
    onPointerDown(e);
  };

  const handleClick = () => {
    if (disabled || !onClick) return;
    onClick();
  };

  return (
    <div
      className={`absolute top-0 bottom-0 bg-gradient-to-b from-amber-900 via-amber-800 to-amber-900 rounded-lg border-2 border-amber-700 shadow-2xl flex flex-col justify-between p-3 transition-all duration-300 ${
        isValidDestination
          ? `ring-4 ring-green-400 ring-opacity-80 bg-green-900/20 animate-pulse scale-105 ${
              isMobile ? "ring-6 shadow-lg shadow-green-500/50" : ""
            }`
          : ""
      } ${
        !disabled && isValidDestination
          ? `cursor-pointer hover:scale-105 ${
              isMobile ? "touch-manipulation active:scale-95" : ""
            }`
          : ""
      }`}
      style={{
        ...sideStyle,
        width: isMobile ? "8%" : "7%", // Slightly wider on mobile for easier tapping
        background: isValidDestination
          ? "linear-gradient(180deg, #065f46 0%, #047857 50%, #065f46 100%)"
          : "linear-gradient(180deg, #78350f 0%, #92400e 50%, #78350f 100%)",
        boxShadow: isValidDestination
          ? "inset 0 2px 8px rgba(6, 95, 70, 0.8), 0 4px 20px rgba(34, 197, 94, 0.4)"
          : "inset 0 2px 8px rgba(120, 53, 15, 0.8), 0 4px 20px rgba(0, 0, 0, 0.3)",
      }}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
    >
      {/* Decorative top accent */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-amber-600 rounded-full opacity-50" />

      {/* Player 1 bear-off area (top) */}
      <div className="flex-1 flex flex-col items-center justify-center p-2 relative">
        {bearOff[1] > 0 && (
          <div className="flex flex-col items-center space-y-2">
            <div className="text-white font-bold text-sm bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center shadow-lg border border-gray-600">
              {bearOff[1]}
            </div>
            <div className="flex flex-col items-center space-y-[-3px]">
              {Array.from({ length: Math.min(bearOff[1], 4) }, (_, i) => (
                <GamePiece
                  key={i}
                  player={1}
                  index={i}
                  isTop={false}
                  isOwnPiece={playerIndex === 1}
                  disabled={disabled}
                  size="small"
                />
              ))}
              {bearOff[1] > 4 && (
                <div className="text-white text-xs font-bold bg-black bg-opacity-70 rounded px-1 mt-1">
                  +{bearOff[1] - 4}
                </div>
              )}
            </div>
          </div>
        )}
        {bearOff[1] === 0 && isValidDestination && playerIndex === 1 && (
          <div className="text-green-300 text-xs font-semibold animate-bounce">
            Drop here
          </div>
        )}
      </div>

      {/* Center divider with decorative element */}
      <div className="h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent my-1" />
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-amber-600 rounded-full border-2 border-amber-800 shadow-lg" />

      {/* Player 0 bear-off area (bottom) */}
      <div className="flex-1 flex flex-col items-center justify-center p-2 relative">
        {bearOff[0] > 0 && (
          <div className="flex flex-col items-center space-y-2">
            <div className="flex flex-col items-center space-y-[-3px]">
              {Array.from({ length: Math.min(bearOff[0], 4) }, (_, i) => (
                <GamePiece
                  key={i}
                  player={0}
                  index={i}
                  isTop={false}
                  isOwnPiece={playerIndex === 0}
                  disabled={disabled}
                  size="small"
                />
              ))}
              {bearOff[0] > 4 && (
                <div className="text-white text-xs font-bold bg-black bg-opacity-70 rounded px-1 mb-1">
                  +{bearOff[0] - 4}
                </div>
              )}
            </div>
            <div className="text-white font-bold text-sm bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center shadow-lg border border-gray-600">
              {bearOff[0]}
            </div>
          </div>
        )}
        {bearOff[0] === 0 && isValidDestination && playerIndex === 0 && (
          <div className="text-green-300 text-xs font-semibold animate-bounce">
            Drop here
          </div>
        )}
      </div>

      {/* Decorative bottom accent */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-amber-600 rounded-full opacity-50" />

      {/* Glow effect when valid destination */}
      {isValidDestination && (
        <div className="absolute inset-0 rounded-lg bg-green-400 opacity-10 animate-pulse pointer-events-none" />
      )}
    </div>
  );
};

export default BearOffArea;
