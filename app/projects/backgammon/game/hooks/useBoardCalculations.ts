import { useState, useEffect, useCallback } from "react";
import { BackgammonGameState, Move } from "../types";
import {
  calculatePointPosition,
  BoardSize,
  PointPosition,
} from "../utils/boardUtils";
import {
  calculateValidMoves,
  ValidMove,
  hasBarPieces,
  getPieceOwner,
  isOwnPiece,
} from "../utils/gameLogic";

interface UseBoardCalculationsProps {
  gameState: BackgammonGameState;
  playerIndex: number | null;
  disabled: boolean;
  onMove: (move: Move) => void;
  boardRef: React.RefObject<HTMLDivElement | null>;
}

export const useBoardCalculations = ({
  gameState,
  playerIndex,
  disabled,
  onMove,
  boardRef,
}: UseBoardCalculationsProps) => {
  const [boardSize, setBoardSize] = useState<BoardSize>({
    width: 0,
    height: 0,
  });
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [validMoves, setValidMoves] = useState<ValidMove[]>([]);

  // Update board size on window resize
  useEffect(() => {
    const updateBoardSize = () => {
      if (boardRef.current) {
        const rect = boardRef.current.getBoundingClientRect();
        setBoardSize({ width: rect.width, height: rect.height });
      }
    };

    updateBoardSize();
    window.addEventListener("resize", updateBoardSize);
    return () => window.removeEventListener("resize", updateBoardSize);
  }, [boardRef]);

  // Calculate point positions based on board size
  const getPointPosition = useCallback(
    (pointIndex: number): PointPosition => {
      return calculatePointPosition(pointIndex, boardSize);
    },
    [boardSize]
  );

  // Update valid moves when selection changes
  useEffect(() => {
    if (selectedPoint !== null && playerIndex !== null) {
      setValidMoves(calculateValidMoves(gameState, selectedPoint, playerIndex));
    } else {
      setValidMoves([]);
    }
  }, [selectedPoint, gameState, playerIndex]);

  // Handle point click (for mobile/touch alternative)
  const handlePointClick = useCallback(
    (pointIndex: number) => {
      if (disabled || playerIndex === null) return;

      // Handle bear-off area (point 25) - this is a destination, not a source
      if (pointIndex === 25) {
        if (selectedPoint !== null) {
          // Check if this is a valid bear-off move
          const isValidMove = validMoves.some((move) => move.to === pointIndex);
          if (isValidMove) {
            // Make bear-off move
            const move: Move = {
              from: selectedPoint,
              to: pointIndex,
              player: playerIndex as 0 | 1,
            };
            onMove(move);
            setSelectedPoint(null);
          }
        }
        return;
      }

      const pieces =
        pointIndex === 0
          ? gameState.bar[playerIndex]
          : gameState.board[pointIndex];
      if (pieces === 0) return;

      const player = (
        pointIndex === 0 ? playerIndex : getPieceOwner(pieces)
      ) as 0 | 1;
      if (player !== playerIndex) return;

      if (selectedPoint === null) {
        setSelectedPoint(pointIndex);
      } else if (selectedPoint === pointIndex) {
        setSelectedPoint(null);
      } else {
        // Check if this is a valid move
        const isValidMove = validMoves.some((move) => move.to === pointIndex);
        if (isValidMove) {
          // Make move
          const move: Move = {
            from: selectedPoint,
            to: pointIndex,
            player: player,
          };
          onMove(move);
          setSelectedPoint(null);
        } else {
          // Select new point
          setSelectedPoint(pointIndex);
        }
      }
    },
    [
      disabled,
      gameState.board,
      gameState.bar,
      playerIndex,
      selectedPoint,
      onMove,
      validMoves,
    ]
  );

  // Check if point is selected
  const isPointSelected = useCallback(
    (pointIndex: number) => selectedPoint === pointIndex,
    [selectedPoint]
  );

  // Check if point is valid destination
  const isValidDestination = useCallback(
    (pointIndex: number) => validMoves.some((move) => move.to === pointIndex),
    [validMoves]
  );

  // Check if point has own pieces
  const hasOwnPieces = useCallback(
    (pointIndex: number) => {
      if (playerIndex === null) return false;
      const pieces =
        pointIndex === 0
          ? gameState.bar[playerIndex]
          : gameState.board[pointIndex];
      return isOwnPiece(pieces, playerIndex);
    },
    [gameState.board, gameState.bar, playerIndex]
  );

  // Check if player has pieces on bar
  const playerHasBarPieces = useCallback(
    (player: number) => hasBarPieces(gameState, player),
    [gameState]
  );

  return {
    boardSize,
    selectedPoint,
    validMoves,
    getPointPosition,
    handlePointClick,
    isPointSelected,
    isValidDestination,
    hasOwnPieces,
    playerHasBarPieces,
    setSelectedPoint,
  };
};
