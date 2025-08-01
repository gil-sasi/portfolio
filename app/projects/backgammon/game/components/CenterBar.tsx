import React from "react";
import { useTranslation } from "react-i18next";
import GamePiece from "./GamePiece";

interface CenterBarProps {
  bar: number[];
  selectedPoint: number | null;
  playerIndex: number | null;
  disabled: boolean;
  onPointerDown: (e: React.PointerEvent, pointIndex: number) => void;
  onClick: (pointIndex: number) => void;
  isMobile?: boolean;
}

const CenterBar: React.FC<CenterBarProps> = ({
  bar,
  selectedPoint,
  playerIndex,
  disabled,
  onPointerDown,
  onClick,
  isMobile = false,
}) => {
  const { t } = useTranslation();
  const hasBarPieces = (player: number) => bar[player] > 0;

  return (
    <div
      className="absolute bg-gradient-to-b from-amber-900 via-amber-800 to-amber-900 border-4 border-amber-700 shadow-2xl rounded-lg"
      style={{
        left: "50%",
        top: "4%",
        width: "5%",
        height: "92%",
        transform: "translateX(-50%)",
        background:
          "linear-gradient(180deg, #78350f 0%, #92400e 30%, #a16207 50%, #92400e 70%, #78350f 100%)",
        boxShadow:
          "inset 0 4px 12px rgba(120, 53, 15, 0.8), 0 8px 30px rgba(0, 0, 0, 0.4)",
      }}
    >
      {/* Decorative elements */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-amber-600 rounded-full opacity-60" />
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-amber-600 rounded-full opacity-60" />

      {/* Center divider line */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-amber-600 rounded-full border-2 border-amber-800 shadow-lg" />

      {/* Bar pieces */}
      <div className="flex flex-col items-center justify-between h-full py-4">
        {/* Player 1 pieces (top half) */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {hasBarPieces(1) && (
            <div
              className={`flex flex-col items-center cursor-pointer transition-all duration-300 p-2 rounded-lg ${
                selectedPoint === 0 && playerIndex === 1
                  ? "ring-4 ring-blue-500 ring-opacity-75 bg-blue-500/20 scale-110"
                  : ""
              } ${
                hasBarPieces(1) && playerIndex === 1
                  ? `hover:bg-blue-400 hover:bg-opacity-20 hover:scale-105 ${
                      isMobile ? "touch-manipulation active:scale-95" : ""
                    }`
                  : ""
              }`}
              style={{
                minHeight: isMobile ? "48px" : "auto",
                minWidth: isMobile ? "48px" : "auto",
                padding: isMobile ? "12px" : "8px",
              }}
              onClick={() => playerIndex === 1 && onClick(0)}
              onPointerDown={(e) => playerIndex === 1 && onPointerDown(e, 0)}
            >
              <div className="flex flex-col items-center space-y-[-2px]">
                {Array.from({ length: Math.min(bar[1], 4) }).map((_, i) => (
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
              </div>
              {bar[1] > 4 && (
                <div
                  className="text-xs font-bold text-white bg-gradient-to-r from-gray-800 to-gray-900 rounded-full px-2 py-1 mt-1 shadow-lg border border-gray-600"
                  style={{
                    pointerEvents: "none",
                    minWidth: "20px",
                    textAlign: "center",
                  }}
                >
                  +{bar[1] - 4}
                </div>
              )}
              {bar[1] > 0 && (
                <div className="text-xs font-bold text-white bg-gray-800 rounded-full w-6 h-6 flex items-center justify-center mt-1 shadow-lg border border-gray-600">
                  {bar[1]}
                </div>
              )}
            </div>
          )}
          {!hasBarPieces(1) && playerIndex === 1 && (
            <div className="text-amber-300 text-xs opacity-50 text-center">
              {t("backgammon.noPiecesOnBar")}
            </div>
          )}
        </div>

        {/* Player 0 pieces (bottom half) */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {hasBarPieces(0) && (
            <div
              className={`flex flex-col items-center cursor-pointer transition-all duration-300 p-2 rounded-lg ${
                selectedPoint === 0 && playerIndex === 0
                  ? "ring-4 ring-blue-500 ring-opacity-75 bg-blue-500/20 scale-110"
                  : ""
              } ${
                hasBarPieces(0) && playerIndex === 0
                  ? `hover:bg-blue-400 hover:bg-opacity-20 hover:scale-105 ${
                      isMobile ? "touch-manipulation active:scale-95" : ""
                    }`
                  : ""
              }`}
              style={{
                minHeight: isMobile ? "48px" : "auto",
                minWidth: isMobile ? "48px" : "auto",
                padding: isMobile ? "12px" : "8px",
              }}
              onClick={() => playerIndex === 0 && onClick(0)}
              onPointerDown={(e) => playerIndex === 0 && onPointerDown(e, 0)}
            >
              {bar[0] > 0 && (
                <div className="text-xs font-bold text-white bg-gray-800 rounded-full w-6 h-6 flex items-center justify-center mb-1 shadow-lg border border-gray-600">
                  {bar[0]}
                </div>
              )}
              {bar[0] > 4 && (
                <div
                  className="text-xs font-bold text-white bg-gradient-to-r from-gray-800 to-gray-900 rounded-full px-2 py-1 mb-1 shadow-lg border border-gray-600"
                  style={{
                    pointerEvents: "none",
                    minWidth: "20px",
                    textAlign: "center",
                  }}
                >
                  +{bar[0] - 4}
                </div>
              )}
              <div className="flex flex-col-reverse items-center space-y-[-2px]">
                {Array.from({ length: Math.min(bar[0], 4) }).map((_, i) => (
                  <GamePiece
                    key={i}
                    player={0}
                    index={i}
                    isTop={true}
                    isOwnPiece={playerIndex === 0}
                    disabled={disabled}
                    size="small"
                  />
                ))}
              </div>
            </div>
          )}
          {!hasBarPieces(0) && playerIndex === 0 && (
            <div className="text-amber-300 text-xs opacity-50 text-center">
              {t("backgammon.noPiecesOnBar")}
            </div>
          )}
        </div>
      </div>

      {/* Subtle inner glow */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-amber-200/10 via-transparent to-amber-400/10 pointer-events-none" />
    </div>
  );
};

export default CenterBar;
