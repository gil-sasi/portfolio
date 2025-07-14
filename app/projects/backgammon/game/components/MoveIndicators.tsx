import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BackgammonGameState } from "../types";
import { calculateValidMoves } from "../utils/gameLogic";
import { PointPosition } from "../utils/boardUtils";
import { hasValidMoves } from "../utils/gameStateManager";

interface MoveIndicatorsProps {
  gameState: BackgammonGameState;
  playerIndex: number | null;
  selectedPoint: number | null;
  getPointPosition: (pointIndex: number) => PointPosition;
  disabled: boolean;
  helperMode: boolean;
  onNoValidMoves?: () => void; // Callback when no valid moves are available
}

const MoveIndicators: React.FC<MoveIndicatorsProps> = ({
  gameState,
  playerIndex,
  selectedPoint,
  getPointPosition,
  disabled,
  helperMode,
  onNoValidMoves,
}) => {
  const { t } = useTranslation();

  // Check for global no valid moves when a piece has no valid moves
  useEffect(() => {
    if (
      selectedPoint !== null &&
      onNoValidMoves &&
      playerIndex !== null &&
      !disabled &&
      gameState.rolled
    ) {
      const selectedPieceValidMoves = calculateValidMoves(
        gameState,
        selectedPoint,
        playerIndex
      );
      // If this piece has no valid moves, check if the player has any valid moves at all
      if (selectedPieceValidMoves.length === 0) {
        const hasAnyValidMoves = hasValidMoves(gameState, playerIndex);
        if (!hasAnyValidMoves) {
          // Player has no valid moves anywhere, trigger turn switch
          onNoValidMoves();
        }
      }
    }
  }, [selectedPoint, gameState, playerIndex, onNoValidMoves, disabled]);

  // Don't show indicators if disabled or not player's turn
  if (disabled || playerIndex === null || !gameState.rolled) {
    return null;
  }

  // Get valid moves for selected piece
  const allValidMoves =
    selectedPoint !== null
      ? calculateValidMoves(gameState, selectedPoint, playerIndex)
      : [];

  // Filter moves: show bear-off moves always, others only in helper mode
  const validMoves = allValidMoves.filter((move) => {
    // Always show bear-off moves (to === 25)
    if (move.to === 25) return true;
    // Show other moves only when helper mode is enabled
    return helperMode;
  });

  // Find all pieces that can move (when no piece is selected) - only in helper mode
  const moveablePieces: number[] = [];
  if (selectedPoint === null && helperMode) {
    // Check bar pieces first
    if (gameState.bar[playerIndex] > 0) {
      const barMoves = calculateValidMoves(gameState, 0, playerIndex);
      if (barMoves.length > 0) {
        moveablePieces.push(0);
      }
    } else {
      // Check board pieces
      for (let point = 1; point <= 24; point++) {
        const pieces = gameState.board[point];
        const isPieceOwned = playerIndex === 0 ? pieces > 0 : pieces < 0;
        if (isPieceOwned) {
          const moves = calculateValidMoves(gameState, point, playerIndex);
          if (moves.length > 0) {
            moveablePieces.push(point);
          }
        }
      }
    }
  }

  return (
    <>
      {/* Highlight moveable pieces when no piece is selected */}
      {selectedPoint === null &&
        moveablePieces.map((pointIndex) => {
          const position = getPointPosition(pointIndex);

          if (pointIndex === 0) {
            // Bar indicator - position it over the center bar
            return (
              <div
                key="bar-indicator"
                className="absolute pointer-events-none z-40"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "60px",
                  height: "200px",
                }}
              >
                <div className="w-full h-full border-4 border-yellow-400 rounded-lg animate-pulse bg-yellow-400/20">
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap">
                    {t("backgammon.clickToMove", "Click to move")}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={`moveable-${pointIndex}`}
              className="absolute pointer-events-none z-40"
              style={{
                left: position.x,
                top: position.y,
                width: position.width,
                height: position.height,
              }}
            >
              <div className="w-full h-full border-4 border-yellow-400 rounded-lg animate-pulse bg-yellow-400/20">
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap">
                  {t("backgammon.clickToMove", "Click to move")}
                </div>
              </div>
            </div>
          );
        })}

      {/* Show move destinations and arrows when a piece is selected */}
      {selectedPoint !== null &&
        validMoves.map((move, index) => {
          const fromPosition = getPointPosition(selectedPoint);

          let toPosition: PointPosition;
          let isBarDestination = false;
          let isBearOffDestination = false;

          if (move.to === 25) {
            // Bear off area - position based on actual bear-off area locations
            isBearOffDestination = true;

            // Calculate bear-off area position based on board layout
            // Bear-off areas are 7% of board width, positioned at left (0) and right (93%)
            const refPosition = getPointPosition(1); // Use point 1 as reference for board dimensions
            const boardWidth = refPosition.x * 2 + refPosition.width * 12; // Approximate board width
            const boardHeight = refPosition.height * 2.5; // Approximate board height from point height

            const bearOffWidth = boardWidth * 0.07; // 7% of board width
            const bearOffHeight = boardHeight * 0.85; // Most of board height

            // Determine which bear-off area to use based on player
            let bearOffX: number;
            let bearOffY: number;

            if (playerIndex === 0) {
              // White player - use right bear-off area
              bearOffX = boardWidth - bearOffWidth;
              bearOffY = boardHeight * 0.08; // Small top margin
            } else {
              // Black player - use left bear-off area
              bearOffX = 0;
              bearOffY = boardHeight * 0.08; // Small top margin
            }

            toPosition = {
              x: bearOffX,
              y: bearOffY,
              width: bearOffWidth,
              height: bearOffHeight,
            };
          } else {
            toPosition = getPointPosition(move.to);
          }

          // Calculate arrow path
          const fromX = fromPosition.x + fromPosition.width / 2;
          const fromY = fromPosition.y + fromPosition.height / 2;
          const toX = toPosition.x + toPosition.width / 2;
          const toY = toPosition.y + toPosition.height / 2;

          // Create curved arrow path
          const midX = (fromX + toX) / 2;
          const midY = (fromY + toY) / 2 - 50; // Curve upward
          const pathData = `M ${fromX} ${fromY} Q ${midX} ${midY} ${toX} ${toY}`;

          return (
            <React.Fragment key={`move-${index}`}>
              {/* Destination highlight */}
              {!isBearOffDestination && (
                <div
                  className="absolute pointer-events-none z-40"
                  style={{
                    left: toPosition.x,
                    top: toPosition.y,
                    width: toPosition.width,
                    height: toPosition.height,
                  }}
                >
                  <div className="w-full h-full border-4 border-green-400 rounded-lg animate-pulse bg-green-400/30">
                    {/* Dice value indicator */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-sm px-3 py-1 rounded-full font-bold shadow-lg">
                      🎲 {move.distance}
                    </div>
                  </div>
                </div>
              )}

              {/* Bear-off area highlight */}
              {isBearOffDestination && (
                <div
                  className="absolute pointer-events-none z-40"
                  style={{
                    left: toPosition.x,
                    top: toPosition.y,
                    width: toPosition.width,
                    height: toPosition.height,
                  }}
                >
                  <div className="w-full h-full border-4 border-purple-400 rounded-lg animate-pulse bg-purple-400/30">
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white text-sm px-3 py-1 rounded-full font-bold shadow-lg">
                      🎯 {move.distance}
                    </div>
                  </div>
                </div>
              )}

              {/* Curved arrow */}
              <svg
                className="absolute pointer-events-none z-30"
                style={{
                  left: 0,
                  top: 0,
                  width: "100%",
                  height: "100%",
                }}
              >
                <defs>
                  <marker
                    id={`arrowhead-${index}`}
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill={isBearOffDestination ? "#a855f7" : "#22c55e"}
                      stroke={isBearOffDestination ? "#a855f7" : "#22c55e"}
                    />
                  </marker>
                </defs>
                <path
                  d={pathData}
                  stroke={isBearOffDestination ? "#a855f7" : "#22c55e"}
                  strokeWidth="3"
                  fill="none"
                  markerEnd={`url(#arrowhead-${index})`}
                  className="animate-pulse"
                  strokeDasharray="8,4"
                />
              </svg>
            </React.Fragment>
          );
        })}

      {/* Instructions overlay - only in helper mode */}
      {helperMode && selectedPoint === null && moveablePieces.length > 0 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce">
          <div className="text-sm font-medium text-center">
            💡{" "}
            {t(
              "backgammon.selectPieceToMove",
              "Click a highlighted piece to see where it can move"
            )}
          </div>
        </div>
      )}

      {/* Move instructions when piece is selected - show for bear-off moves always, others only in helper mode */}
      {selectedPoint !== null && validMoves.length > 0 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <div className="text-sm font-medium text-center">
            🎯{" "}
            {validMoves.some((move) => move.to === 25)
              ? t(
                  "backgammon.clickToBearOff",
                  "Click the bear-off area to bear off"
                )
              : t(
                  "backgammon.clickDestination",
                  "Click a highlighted destination to move"
                )}
          </div>
        </div>
      )}

      {/* No moves available message - only in helper mode */}
      {helperMode && selectedPoint !== null && allValidMoves.length === 0 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <div className="text-sm font-medium text-center">
            ❌ {t("backgammon.noValidMoves", "No valid moves for this piece")}
          </div>
        </div>
      )}
    </>
  );
};

export default MoveIndicators;
