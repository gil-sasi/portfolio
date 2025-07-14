import React from "react";

interface GamePieceProps {
  player: 0 | 1;
  index: number;
  isTop: boolean;
  isOwnPiece: boolean;
  disabled: boolean;
  size?: "small" | "normal";
}

const GamePiece: React.FC<GamePieceProps> = ({
  player,
  index,
  isTop,
  isOwnPiece,
  disabled,
  size = "normal",
}) => {
  const pieceSize = size === "small" ? "w-6 h-6" : "w-8 h-8";
  const stackOffset = size === "small" ? 3 : 6;

  return (
    <div
      className={`${pieceSize} rounded-full border-2 shadow-lg relative ${
        player === 0
          ? "bg-gradient-to-br from-white via-gray-100 to-gray-200 border-gray-300"
          : "bg-gradient-to-br from-gray-800 via-gray-900 to-black border-gray-700"
      } ${
        isOwnPiece && !disabled
          ? "hover:scale-110 transition-transform cursor-pointer"
          : ""
      }`}
      style={{
        marginTop: isTop ? index * -stackOffset : 0,
        marginBottom: !isTop ? index * -stackOffset : 0,
        boxShadow:
          player === 0
            ? "0 3px 10px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.8)"
            : "0 3px 10px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.1)",
      }}
    >
      {/* Inner circle pattern */}
      <div
        className="absolute inset-1 rounded-full border opacity-30"
        style={{
          borderColor: player === 0 ? "#00000040" : "#ffffff40",
        }}
      />
      {/* Center dot */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full opacity-50"
        style={{
          backgroundColor: player === 0 ? "#00000060" : "#ffffff60",
        }}
      />
    </div>
  );
};

export default GamePiece;
