import { BackgammonGameState } from "../types";

export interface ValidMove {
  from: number;
  to: number;
  distance: number;
}

// Helper function to get valid dice values, handling doubles correctly
export const getValidDiceValues = (
  gameState: BackgammonGameState
): number[] => {
  // Since dice array now contains all available dice (including 4 for doubles),
  // we just need to filter out used dice (zeros)
  return gameState.dice.filter((die) => die > 0);
};

export const hasBarPieces = (
  gameState: BackgammonGameState,
  player: number
): boolean => {
  return gameState.bar[player] > 0;
};

export const getPieceOwner = (pieces: number): 0 | 1 | null => {
  if (pieces === 0) return null;
  // Player 0 (AI) has positive pieces, Player 1 (human) has negative pieces
  return pieces > 0 ? 0 : 1;
};

export const calculateValidMoves = (
  gameState: BackgammonGameState,
  fromPoint: number,
  playerIndex: number
): ValidMove[] => {
  if (!gameState.rolled || playerIndex === null) return [];

  const validDiceValues = getValidDiceValues(gameState);
  const moves: ValidMove[] = [];

  // If player has pieces on bar, they must move those first
  if (hasBarPieces(gameState, playerIndex) && fromPoint !== 0) {
    return [];
  }

  validDiceValues.forEach((die) => {
    let toPoint: number;

    if (fromPoint === 0) {
      // Moving from bar - enter into opponent's home board
      // Player 0 (White) enters into Black's home board (19-24)
      // Player 1 (Black) enters into White's home board (1-6)
      toPoint = playerIndex === 0 ? 25 - die : die;
    } else {
      // Normal move
      // Player 0 (White) moves towards lower numbers (towards home 1-6)
      // Player 1 (Black) moves towards higher numbers (towards home 19-24)
      toPoint = playerIndex === 0 ? fromPoint - die : fromPoint + die;
    }

    if (toPoint >= 1 && toPoint <= 24) {
      const toPieces = gameState.board[toPoint];

      // Check if destination is valid
      const isValidDestination = isValidMoveDestination(toPieces, playerIndex);

      if (isValidDestination) {
        moves.push({ from: fromPoint, to: toPoint, distance: die });
      }
    }

    // Check for bearing off moves (only for pieces in home board)
    if (
      fromPoint !== 0 &&
      canBearOffFromPoint(gameState, fromPoint, die, playerIndex)
    ) {
      moves.push({ from: fromPoint, to: 25, distance: die }); // 25 represents "off the board"
    }
  });

  return moves;
};

export const isValidMoveDestination = (
  toPieces: number,
  playerIndex: number
): boolean => {
  if (toPieces === 0) {
    // Empty point - always valid
    return true;
  }

  if (playerIndex === 0) {
    // Player 0: can move to own pieces (positive) or single opponent piece (negative with abs value 1)
    return toPieces > 0 || (toPieces < 0 && Math.abs(toPieces) === 1);
  } else {
    // Player 1: can move to own pieces (negative) or single opponent piece (positive with value 1)
    return toPieces < 0 || (toPieces > 0 && toPieces === 1);
  }
};

export const isOwnPiece = (pieces: number, playerIndex: number): boolean => {
  if (pieces === 0) return false;
  const owner = getPieceOwner(pieces);
  return owner === playerIndex;
};

// Bearing off logic
export const getHomeBoard = (playerIndex: number): [number, number] => {
  // White (Player 0): Points 1-6
  // Black (Player 1): Points 19-24
  return playerIndex === 0 ? [1, 6] : [19, 24];
};

export const isInHomeBoard = (point: number, playerIndex: number): boolean => {
  const [homeStart, homeEnd] = getHomeBoard(playerIndex);
  return point >= homeStart && point <= homeEnd;
};

export const areAllPiecesInHomeBoard = (
  gameState: BackgammonGameState,
  playerIndex: number
): boolean => {
  // Check if player has any pieces on the bar
  if (gameState.bar[playerIndex] > 0) {
    return false;
  }

  // Check all points on the board
  for (let point = 1; point <= 24; point++) {
    const pieces = gameState.board[point];

    // Check if this point has pieces belonging to the player
    if (playerIndex === 0 && pieces > 0) {
      // White player has positive pieces
      if (!isInHomeBoard(point, playerIndex)) {
        return false;
      }
    } else if (playerIndex === 1 && pieces < 0) {
      // Black player has negative pieces
      if (!isInHomeBoard(point, playerIndex)) {
        return false;
      }
    }
  }

  return true;
};

export const canBearOffFromPoint = (
  gameState: BackgammonGameState,
  fromPoint: number,
  dieValue: number,
  playerIndex: number
): boolean => {
  // Must be in home board
  if (!isInHomeBoard(fromPoint, playerIndex)) {
    // Only log if this is likely a user-initiated move (not AI calculations)
    if (gameState.currentPlayer === playerIndex) {
      console.log(
        `Bear-off rejected: Point ${fromPoint} is not in home board for player ${playerIndex} (home board: ${
          playerIndex === 0 ? "1-6" : "19-24"
        })`
      );
    }
    return false;
  }

  // All pieces must be in home board
  if (!areAllPiecesInHomeBoard(gameState, playerIndex)) {
    if (gameState.currentPlayer === playerIndex) {
      console.log(
        `Bear-off rejected: Not all pieces are in home board for player ${playerIndex}`
      );
    }
    return false;
  }

  const [homeStart, homeEnd] = getHomeBoard(playerIndex);

  // Helper function to find the highest occupied point for a player
  const findHighestOccupiedPoint = (playerIdx: number): number => {
    for (let point = homeEnd; point >= homeStart; point--) {
      const pieces = gameState.board[point];
      if (playerIdx === 0 && pieces > 0) {
        return point;
      } else if (playerIdx === 1 && pieces < 0) {
        return point;
      }
    }
    return -1; // No pieces found
  };

  if (playerIndex === 0) {
    // White player: home board is points 1-6

    // Case 1: Die matches exact point for bearing off
    if (fromPoint === dieValue) {
      return true;
    }

    // Case 2: Die value is higher than point, but no pieces on higher points
    if (dieValue > fromPoint) {
      // Check if this is the highest occupied point for this player
      for (let point = fromPoint + 1; point <= homeEnd; point++) {
        const pieces = gameState.board[point];
        if (pieces > 0) {
          // White player has positive pieces
          return false; // There are pieces on higher points
        }
      }
      return true; // No pieces on higher points, can bear off
    }

    // Case 3: Die value doesn't match exact point and is not higher
    // Check if there's no piece on the exact point and this is the highest occupied point
    if (dieValue < fromPoint) {
      const exactPoint = dieValue;
      const piecesOnExactPoint = gameState.board[exactPoint];

      // If there are pieces on the exact point, you must use those first
      if (piecesOnExactPoint > 0) {
        return false;
      }

      // If no pieces on exact point, check if current point is the highest occupied
      const highestOccupiedPoint = findHighestOccupiedPoint(playerIndex);
      return fromPoint === highestOccupiedPoint;
    }
  } else {
    // Black player: home board is points 19-24

    // Case 1: Die matches exact point for bearing off
    const exactBearOffPoint = 25 - dieValue;
    if (fromPoint === exactBearOffPoint) {
      return true;
    }

    // Case 2: Die value is higher than needed, but no pieces on higher points
    if (dieValue > 25 - fromPoint) {
      // Check if this is the highest occupied point for this player
      for (let point = fromPoint + 1; point <= homeEnd; point++) {
        const pieces = gameState.board[point];
        if (pieces < 0) {
          // Black player has negative pieces
          return false; // There are pieces on higher points
        }
      }
      return true; // No pieces on higher points, can bear off
    }

    // Case 3: Die value doesn't match exact point and is not higher
    // Check if there's no piece on the exact point and this is the highest occupied point
    if (dieValue < 25 - fromPoint) {
      const exactPoint = 25 - dieValue;
      const piecesOnExactPoint = gameState.board[exactPoint];

      // If there are pieces on the exact point, you must use those first
      if (piecesOnExactPoint < 0) {
        return false;
      }

      // If no pieces on exact point, check if current point is the highest occupied
      const highestOccupiedPoint = findHighestOccupiedPoint(playerIndex);
      return fromPoint === highestOccupiedPoint;
    }
  }

  return false;
};

export const isBearOffMove = (move: { from: number; to: number }): boolean => {
  // Bear off moves are represented as moves to point 25 (off the board)
  return move.to === 25;
};

export const findTargetPointFromPosition = (
  relativeX: number,
  relativeY: number,
  boardSize: { width: number; height: number },
  getPointPosition: (pointIndex: number) => {
    x: number;
    y: number;
    width: number;
    height: number;
  }
): number => {
  // Check bear-off areas first (left and right sides)
  const bearOffWidth = boardSize.width * 0.06; // 6% of board width

  // Left bear-off area - for Player 1 (Black)
  if (relativeX >= 0 && relativeX <= bearOffWidth) {
    return 25; // Bear-off point
  }

  // Right bear-off area - for Player 0 (White)
  if (
    relativeX >= boardSize.width - bearOffWidth &&
    relativeX <= boardSize.width
  ) {
    return 25; // Bear-off point
  }

  // Check regular points
  for (let i = 1; i <= 24; i++) {
    const pos = getPointPosition(i);
    if (
      relativeX >= pos.x &&
      relativeX <= pos.x + pos.width &&
      relativeY >= pos.y &&
      relativeY <= pos.y + pos.height
    ) {
      return i;
    }
  }

  return -1;
};
