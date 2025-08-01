"use client";

import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BackgammonGameState, Player, Move } from "../types";
import { useBoardCalculations } from "../hooks/useBoardCalculations";
import { useDragAndDrop } from "../hooks/useDragAndDrop";
import { useIsMobile } from "../hooks/useIsMobile";
import { getBoardStyles, getWoodGrainStyles } from "../utils/boardUtils";
import { areAllPiecesInHomeBoard } from "../utils/gameLogic";
import DiceDisplay from "./DiceDisplay";
import GamePoint from "./GamePoint";
import CenterBar from "./CenterBar";
import BearOffArea from "./BearOffArea";
import BearOffAnimation from "./BearOffAnimation";
import PieceMovementAnimation from "./PieceMovementAnimation";
import GamePiece from "./GamePiece";
import CheckerCounts from "./CheckerCounts";
import MoveIndicators from "./MoveIndicators";
import MoveHints from "./MoveHints";

interface BackgammonBoardProps {
  gameState: BackgammonGameState;
  players: [Player, Player];
  playerIndex: number | null;
  onMove: (move: Move) => void;
  onRollDice: () => void;
  disabled: boolean;
  onNoValidMoves?: () => void; // Callback when no valid moves are available
}

export default function BackgammonBoard({
  gameState,
  playerIndex,
  onMove,
  onRollDice,
  disabled,
  onNoValidMoves,
}: BackgammonBoardProps) {
  const { t } = useTranslation();
  const boardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [bearOffAnimation, setBearOffAnimation] = useState<{
    isActive: boolean;
    player: 0 | 1;
    fromPosition: { x: number; y: number };
  } | null>(null);

  const [pieceMovementAnimation, setPieceMovementAnimation] = useState<{
    isActive: boolean;
    player: 0 | 1;
    fromPosition: { x: number; y: number };
    toPosition: { x: number; y: number };
  } | null>(null);

  // Helper toggle state with localStorage persistence
  // Always enable helper mode on mobile for better usability
  const [helperMode, setHelperMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("backgammon-helper-mode");
      return isMobile ? true : saved !== null ? JSON.parse(saved) : true; // Always enabled on mobile
    }
    return true;
  });

  // Force helper mode to be enabled on mobile
  useEffect(() => {
    if (isMobile && !helperMode) {
      setHelperMode(true);
    }
  }, [isMobile, helperMode]);

  // Save helper mode preference to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "backgammon-helper-mode",
        JSON.stringify(helperMode)
      );
    }
  }, [helperMode]);

  const toggleHelperMode = () => {
    setHelperMode(!helperMode);
  };

  // Use custom hooks for logic
  const {
    getPointPosition,
    handlePointClick,
    isPointSelected,
    isValidDestination,
    selectedPoint,
    hasOwnPieces,
    setSelectedPoint,
  } = useBoardCalculations({
    gameState,
    playerIndex,
    disabled,
    onMove: (move: Move) => {
      // Check if this is a bearing off move and trigger animation
      if (move.to === 25 && boardRef.current) {
        const fromPos = getPointPosition(move.from);
        const boardRect = boardRef.current.getBoundingClientRect();

        setBearOffAnimation({
          isActive: true,
          player: move.player,
          fromPosition: {
            x: boardRect.left + fromPos.x + fromPos.width / 2,
            y:
              boardRect.top +
              fromPos.y +
              (move.from >= 13 ? 0 : fromPos.height),
          },
        });

        // Delay the actual move to show animation
        setTimeout(() => {
          onMove(move);
        }, 200);
      } else if (isMobile && boardRef.current) {
        // Regular move animation on mobile
        const fromPos = getPointPosition(move.from);
        const toPos = getPointPosition(move.to);
        const boardRect = boardRef.current.getBoundingClientRect();

        setPieceMovementAnimation({
          isActive: true,
          player: move.player,
          fromPosition: {
            x: boardRect.left + fromPos.x + fromPos.width / 2,
            y:
              boardRect.top +
              fromPos.y +
              (move.from >= 13 ? 0 : fromPos.height),
          },
          toPosition: {
            x: boardRect.left + toPos.x + toPos.width / 2,
            y: boardRect.top + toPos.y + (move.to >= 13 ? 0 : toPos.height),
          },
        });

        // Delay the actual move to show animation
        setTimeout(
          () => {
            onMove(move);
          },
          isMobile ? 400 : 300
        );
      } else {
        onMove(move);
      }
    },
    boardRef,
  });

  // Use drag and drop hook - disabled on mobile for better touch experience
  const { dragState, handlePointerDown, handlePointerMove, handlePointerUp } =
    useDragAndDrop({
      gameState,
      playerIndex,
      onMove: (move: Move) => {
        // Same animation logic for drag and drop
        if (move.to === 25 && boardRef.current) {
          const fromPos = getPointPosition(move.from);
          const boardRect = boardRef.current.getBoundingClientRect();

          setBearOffAnimation({
            isActive: true,
            player: move.player,
            fromPosition: {
              x: boardRect.left + fromPos.x + fromPos.width / 2,
              y:
                boardRect.top +
                fromPos.y +
                (move.from >= 13 ? 0 : fromPos.height),
            },
          });

          setTimeout(() => {
            onMove(move);
          }, 200);
        } else {
          onMove(move);
        }
      },
      boardRef,
      getPointPosition,
      disabled: disabled || isMobile, // Disable drag on mobile
    });

  // Check if player can bear off
  const canPlayerBearOff =
    playerIndex !== null
      ? areAllPiecesInHomeBoard(gameState, playerIndex)
      : false;

  // Clear selected point when dragging starts
  useEffect(() => {
    if (dragState.isDragging) {
      setSelectedPoint(null);
    }
  }, [dragState.isDragging, setSelectedPoint]);

  return (
    <div className="flex flex-col items-center py-8 space-y-6">
      {/* Helper toggle button - hidden on mobile since it's always enabled */}
      {!isMobile && (
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleHelperMode}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200
              ${
                helperMode
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-600 hover:bg-gray-700 text-gray-200"
              }
            `}
          >
            <span className="text-sm">
              {helperMode
                ? t("backgammon.helperModeOn")
                : t("backgammon.helperModeOff")}
            </span>
          </button>
        </div>
      )}

      {/* Mobile-specific helper text */}
      {isMobile && (
        <div className="text-center text-sm text-green-400 mb-4">
          <span className="bg-green-600/20 px-3 py-1 rounded-full">
            📱{" "}
            {t("backgammon.mobileHelperMode", "Mobile Helper Mode: Always On")}
          </span>
        </div>
      )}

      {/* Game layout with relative positioning */}
      <div className="relative">
        {/* Enhanced Player information */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="text-sm font-semibold text-amber-100">
            {playerIndex !== null ? (
              <>
                <span className="text-green-400">
                  {t("backgammon.youArePlayer")} {playerIndex}
                </span>
                <span className="mx-2">•</span>
                <span
                  className={
                    playerIndex === 0 ? "text-amber-100" : "text-gray-300"
                  }
                >
                  {t("backgammon.youPlayWith")}{" "}
                  {playerIndex === 0
                    ? t("backgammon.whitePieces")
                    : t("backgammon.blackPieces")}
                </span>
                <span className="mx-2">•</span>
                <span className="text-blue-400 font-bold">
                  {playerIndex === 0
                    ? t("backgammon.homeBoard1to6")
                    : t("backgammon.homeBoard19to24")}
                </span>
              </>
            ) : (
              <span className="text-gray-400">
                {t("backgammon.observingGame")}
              </span>
            )}
          </div>
          {playerIndex !== null && (
            <div className="text-xs text-amber-200/80 max-w-md">
              {gameState.currentPlayer === playerIndex ? (
                <span className="text-green-400 font-semibold">
                  {t("backgammon.yourTurn")}
                </span>
              ) : (
                <span>{t("backgammon.waitingForOpponent")}</span>
              )}
            </div>
          )}
        </div>

        {/* Checker counts display */}
        <CheckerCounts gameState={gameState} playerIndex={playerIndex} />

        {/* Move hints and guidance - only show when helper mode is enabled */}
        {helperMode && (
          <div className="flex justify-center mb-4">
            <MoveHints
              gameState={gameState}
              playerIndex={playerIndex}
              disabled={disabled}
            />
          </div>
        )}

        {/* Enhanced header with bear off status */}
        <div className="mb-6">
          <div className="text-center text-xs font-medium text-amber-200">
            {canPlayerBearOff && playerIndex !== null ? (
              <span className="text-green-400 animate-pulse">
                ✅ {t("backgammon.canBearOff", "You can bear off!")}
              </span>
            ) : (
              <span className="text-amber-200/60">
                {t(
                  "backgammon.moveToHomeFirst",
                  "Move all pieces to home board first"
                )}
              </span>
            )}
          </div>
        </div>

        {/* Enhanced Quadrant labels with point numbers */}
        <div className="absolute -top-6 left-0 text-xs text-amber-200 font-semibold bg-amber-900/30 px-2 py-1 rounded border border-amber-700/50">
          {t("backgammon.whitesHomeBoard")}
        </div>
        <div className="absolute -top-6 right-0 text-xs text-amber-200 font-semibold bg-amber-900/30 px-2 py-1 rounded border border-amber-700/50">
          {t("backgammon.blacksHomeBoard")}
        </div>

        <div
          ref={boardRef}
          className={`relative rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-800 mx-auto ${
            isMobile ? "touch-none" : ""
          }`}
          style={{
            ...getBoardStyles(),
            filter: "drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3))",
            // Slightly smaller on mobile for better viewport fit
            width: isMobile ? "min(95vw, 700px)" : "min(90vw, 800px)",
            minWidth: isMobile ? 350 : 400,
          }}
          onPointerMove={isMobile ? undefined : handlePointerMove}
          onPointerUp={isMobile ? undefined : handlePointerUp}
          onPointerCancel={isMobile ? undefined : handlePointerUp}
        >
          {/* Enhanced wood grain texture overlay */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={getWoodGrainStyles()}
          />

          {/* Subtle inner glow */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-amber-200/10 via-transparent to-amber-800/10" />

          {/* Enhanced Bear-off areas */}
          <BearOffArea
            bearOff={gameState.bearOff}
            side="left"
            isValidDestination={isValidDestination(25) && playerIndex === 1}
            onPointerDown={(e) => (isMobile ? {} : handlePointerDown(e, 25))}
            onClick={() => handlePointClick(25)}
            disabled={disabled}
            playerIndex={playerIndex}
            isMobile={isMobile}
          />
          <BearOffArea
            bearOff={gameState.bearOff}
            side="right"
            isValidDestination={isValidDestination(25) && playerIndex === 0}
            onPointerDown={(e) => (isMobile ? {} : handlePointerDown(e, 25))}
            onClick={() => handlePointClick(25)}
            disabled={disabled}
            playerIndex={playerIndex}
            isMobile={isMobile}
          />

          {/* Enhanced Center bar */}
          <CenterBar
            bar={gameState.bar}
            selectedPoint={selectedPoint}
            playerIndex={playerIndex}
            disabled={disabled}
            onPointerDown={isMobile ? () => {} : handlePointerDown}
            onClick={handlePointClick}
            isMobile={isMobile}
          />

          {/* Render all points with enhanced styling */}
          {Array.from({ length: 24 }, (_, i) => {
            const pointIndex = i + 1;
            const pieces = gameState.board[pointIndex];
            const position = getPointPosition(pointIndex);

            return (
              <GamePoint
                key={pointIndex}
                pointIndex={pointIndex}
                pieces={pieces}
                position={position}
                isSelected={isPointSelected(pointIndex)}
                isValidDestination={isValidDestination(pointIndex)}
                isOwnPiece={hasOwnPieces(pointIndex)}
                disabled={disabled}
                playerIndex={playerIndex}
                onPointerDown={isMobile ? () => {} : handlePointerDown}
                onClick={handlePointClick}
                isInPlayerHomeBoard={
                  playerIndex !== null &&
                  ((playerIndex === 0 && pointIndex >= 1 && pointIndex <= 6) ||
                    (playerIndex === 1 && pointIndex >= 19 && pointIndex <= 24))
                }
                helperMode={helperMode}
                isMobile={isMobile}
              />
            );
          })}

          {/* Move indicators and guidance - always show bear-off indicators, other hints only in helper mode */}
          <MoveIndicators
            gameState={gameState}
            playerIndex={playerIndex}
            selectedPoint={selectedPoint}
            getPointPosition={getPointPosition}
            disabled={disabled}
            helperMode={helperMode}
            onNoValidMoves={onNoValidMoves}
            isMobile={isMobile}
          />

          {/* Dragging piece with enhanced styling */}
          {dragState.isDragging && dragState.piece && (
            <div
              className="absolute pointer-events-none z-50"
              style={{
                left: dragState.dragOffset.x - 16,
                top: dragState.dragOffset.y - 16,
                filter: "drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4))",
                transform: "scale(1.1)",
              }}
            >
              <GamePiece
                player={dragState.piece.player}
                index={0}
                isTop={false}
                isOwnPiece={true}
                disabled={false}
              />
            </div>
          )}

          {/* Bearing off animation */}
          {bearOffAnimation && (
            <BearOffAnimation
              isActive={bearOffAnimation.isActive}
              player={bearOffAnimation.player}
              fromPosition={bearOffAnimation.fromPosition}
              onComplete={() => setBearOffAnimation(null)}
            />
          )}
        </div>
      </div>

      {/* Dice and controls section */}
      <div className="glass rounded-xl p-4">
        <div className="text-center text-sm font-medium text-amber-200 mb-2">
          {t("backgammon.dice")}
        </div>
        <DiceDisplay
          dice={gameState.dice}
          onRollDice={onRollDice}
          canRoll={
            !disabled &&
            !gameState.rolled &&
            gameState.currentPlayer === playerIndex
          }
          playerIndex={playerIndex}
        />
      </div>
    </div>
  );
}
