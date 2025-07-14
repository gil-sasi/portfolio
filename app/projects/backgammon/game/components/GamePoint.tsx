import React from "react";
import GamePiece from "./GamePiece";
import SVGTriangle from "./SVGTriangle";
import { getPieceOwner } from "../utils/gameLogic";
import { isRedTriangle } from "../utils/boardUtils";

interface GamePointProps {
  pointIndex: number;
  pieces: number;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  isSelected: boolean;
  isValidDestination: boolean;
  isOwnPiece: boolean;
  disabled: boolean;
  playerIndex: number | null;
  onPointerDown: (e: React.PointerEvent, pointIndex: number) => void;
  onClick: (pointIndex: number) => void;
  isInPlayerHomeBoard?: boolean;
  helperMode?: boolean;
}

const GamePoint: React.FC<GamePointProps> = ({
  pointIndex,
  pieces,
  position,
  isSelected,
  isValidDestination,
  isOwnPiece,
  disabled,
  onPointerDown,
  onClick,
  isInPlayerHomeBoard = false,
  helperMode = false,
}) => {
  const player = getPieceOwner(pieces);
  const pieceCount = Math.abs(pieces);
  const isTop = pointIndex >= 13 && pointIndex <= 24;

  return (
    <div className="relative">
      <div
        className={`absolute cursor-pointer transition-all duration-300 ${
          isSelected
            ? "ring-4 ring-blue-500 ring-opacity-75 z-50 scale-105"
            : isValidDestination
            ? "ring-4 ring-green-500 ring-opacity-75 animate-pulse"
            : isInPlayerHomeBoard && helperMode
            ? "ring-2 ring-yellow-400 ring-opacity-60 shadow-lg shadow-yellow-400/30"
            : ""
        }`}
        style={{
          left: position.x,
          top: position.y,
          width: position.width,
          height: position.height,
        }}
        onPointerDown={(e) => onPointerDown(e, pointIndex)}
        onClick={() => onClick(pointIndex)}
      >
        {/* Enhanced SVG Triangle shape */}
        <SVGTriangle
          pointIndex={pointIndex}
          isTop={isTop}
          width={position.width}
          height={position.height}
          className={`
            hover:brightness-110 
            ${isSelected ? "brightness-120 saturate-130" : ""}
            ${isValidDestination ? "brightness-105" : ""}
          `}
        />

        {/* Point number label */}
        <div
          className={`absolute left-1/2 transform -translate-x-1/2 pointer-events-none z-10 ${
            isTop ? "top-1" : "bottom-1"
          }`}
          style={{
            fontSize: "11px",
            fontWeight: "700",
            color:
              isInPlayerHomeBoard && helperMode
                ? "#fbbf24" // Yellow for home board points when helper is on
                : isRedTriangle(pointIndex)
                ? "#ffffff" // White text on red triangles
                : "#000000", // Black text on light triangles
            textShadow: isRedTriangle(pointIndex)
              ? "0 1px 2px rgba(0,0,0,0.8)" // Dark shadow on red
              : "0 1px 2px rgba(255,255,255,0.8)", // Light shadow on light
            background:
              isInPlayerHomeBoard && helperMode
                ? "rgba(251, 191, 36, 0.2)" // Semi-transparent yellow background for home board when helper is on
                : "rgba(0, 0, 0, 0.1)", // Subtle background
            borderRadius: "4px",
            padding: "1px 3px",
          }}
        >
          {pointIndex}
        </div>

        {/* Enhanced Pieces rendering */}
        {pieceCount > 0 && player !== null && (
          <div
            className={`absolute ${
              isTop ? "top-2" : "bottom-2"
            } left-1/2 transform -translate-x-1/2 flex ${
              isTop ? "flex-col" : "flex-col-reverse"
            } items-center transition-all duration-200`}
          >
            {Array.from({ length: Math.min(pieceCount, 5) }).map((_, i) => (
              <GamePiece
                key={i}
                player={player}
                index={i}
                isTop={isTop}
                isOwnPiece={isOwnPiece}
                disabled={disabled}
              />
            ))}
            {pieceCount > 5 && (
              <div
                className="text-xs font-bold text-white bg-gradient-to-r from-gray-800 to-gray-900 rounded-full px-2 py-1 mt-1 shadow-lg border border-gray-600"
                style={{
                  pointerEvents: "none",
                  minWidth: "20px",
                  textAlign: "center",
                }}
              >
                +{pieceCount - 5}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePoint;
