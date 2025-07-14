import { useState, useCallback } from "react";
import { Move } from "../types";
import { getPieceOwner, findTargetPointFromPosition } from "../utils/gameLogic";

export interface DragState {
  isDragging: boolean;
  piece: { point: number; player: 0 | 1 } | null;
  dragOffset: { x: number; y: number };
  startPos: { x: number; y: number };
}

interface UseDragAndDropProps {
  disabled: boolean;
  gameState: {
    board: number[];
    bar: number[];
  };
  playerIndex: number | null;
  onMove: (move: Move) => void;
  boardRef: React.RefObject<HTMLDivElement | null>;
  getPointPosition: (pointIndex: number) => {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export const useDragAndDrop = ({
  disabled,
  gameState,
  playerIndex,
  onMove,
  boardRef,
  getPointPosition,
}: UseDragAndDropProps) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    piece: null,
    dragOffset: { x: 0, y: 0 },
    startPos: { x: 0, y: 0 },
  });

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, pointIndex: number) => {
      if (disabled) return;

      const pieces =
        pointIndex === 0
          ? gameState.bar[playerIndex || 0]
          : gameState.board[pointIndex];
      if (pieces === 0) return;

      const player = (
        pointIndex === 0 ? playerIndex || 0 : getPieceOwner(pieces)
      ) as 0 | 1;
      if (player !== playerIndex) return;

      const rect = boardRef.current?.getBoundingClientRect();
      if (!rect) return;

      const clientX =
        e.clientX ||
        (e as unknown as React.TouchEvent).touches?.[0]?.clientX ||
        0;
      const clientY =
        e.clientY ||
        (e as unknown as React.TouchEvent).touches?.[0]?.clientY ||
        0;

      setDragState({
        isDragging: true,
        piece: { point: pointIndex, player },
        dragOffset: { x: clientX - rect.left, y: clientY - rect.top },
        startPos: { x: clientX, y: clientY },
      });

      e.preventDefault();
    },
    [disabled, gameState.board, gameState.bar, playerIndex, boardRef]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragState.isDragging || disabled) return;

      const rect = boardRef.current?.getBoundingClientRect();
      if (!rect) return;

      const clientX =
        e.clientX ||
        (e as unknown as React.TouchEvent).touches?.[0]?.clientX ||
        0;
      const clientY =
        e.clientY ||
        (e as unknown as React.TouchEvent).touches?.[0]?.clientY ||
        0;

      setDragState((prev) => ({
        ...prev,
        dragOffset: { x: clientX - rect.left, y: clientY - rect.top },
      }));

      e.preventDefault();
    },
    [dragState.isDragging, disabled, boardRef]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!dragState.isDragging || !dragState.piece) return;

      const rect = boardRef.current?.getBoundingClientRect();
      if (!rect) return;

      const clientX =
        e.clientX ||
        (e as unknown as React.TouchEvent).changedTouches?.[0]?.clientX ||
        0;
      const clientY =
        e.clientY ||
        (e as unknown as React.TouchEvent).changedTouches?.[0]?.clientY ||
        0;

      const relativeX = clientX - rect.left;
      const relativeY = clientY - rect.top;

      const targetPoint = findTargetPointFromPosition(
        relativeX,
        relativeY,
        { width: rect.width, height: rect.height },
        getPointPosition
      );

      if (targetPoint !== -1 && targetPoint !== dragState.piece.point) {
        const move: Move = {
          from: dragState.piece.point,
          to: targetPoint,
          player: dragState.piece.player,
        };

        // Debug bear-off attempts
        if (targetPoint === 25) {
          console.log("Bear-off drag attempt:", {
            from: dragState.piece.point,
            to: targetPoint,
            player: dragState.piece.player,
            playerHomeBoard: dragState.piece.player === 0 ? "1-6" : "19-24",
            isValidHomeBoard:
              dragState.piece.player === 0
                ? dragState.piece.point >= 1 && dragState.piece.point <= 6
                : dragState.piece.point >= 19 && dragState.piece.point <= 24,
            dropArea:
              relativeX <=
              boardRef.current!.getBoundingClientRect().width * 0.06
                ? "left"
                : "right",
          });
        }

        onMove(move);
      }

      setDragState({
        isDragging: false,
        piece: null,
        dragOffset: { x: 0, y: 0 },
        startPos: { x: 0, y: 0 },
      });

      e.preventDefault();
    },
    [dragState, getPointPosition, onMove, boardRef]
  );

  const resetDrag = useCallback(() => {
    setDragState({
      isDragging: false,
      piece: null,
      dragOffset: { x: 0, y: 0 },
      startPos: { x: 0, y: 0 },
    });
  }, []);

  return {
    dragState,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    resetDrag,
  };
};
