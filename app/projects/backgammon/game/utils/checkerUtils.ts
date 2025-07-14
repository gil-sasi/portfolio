import { BackgammonGameState } from "../types";

/**
 * Calculate the number of checkers on the board for a specific player
 */
export const getCheckersOnBoard = (
  gameState: BackgammonGameState,
  player: 0 | 1
): number => {
  let count = 0;

  // Count checkers on the board points (1-24)
  for (let i = 1; i <= 24; i++) {
    const pieces = gameState.board[i];
    if (player === 0 && pieces > 0) {
      count += pieces;
    } else if (player === 1 && pieces < 0) {
      count += Math.abs(pieces);
    }
  }

  // Add checkers on the bar
  count += gameState.bar[player];

  return count;
};

/**
 * Calculate the number of checkers in the home board for a specific player
 */
export const getCheckersAtHome = (
  gameState: BackgammonGameState,
  player: 0 | 1
): number => {
  let count = 0;

  // White player (0) home board is points 1-6
  // Black player (1) home board is points 19-24
  const homeStart = player === 0 ? 1 : 19;
  const homeEnd = player === 0 ? 6 : 24;

  for (let i = homeStart; i <= homeEnd; i++) {
    const pieces = gameState.board[i];
    if (player === 0 && pieces > 0) {
      count += pieces;
    } else if (player === 1 && pieces < 0) {
      count += Math.abs(pieces);
    }
  }

  return count;
};

/**
 * Calculate the number of checkers that have been born off for a specific player
 */
export const getCheckersBornOff = (
  gameState: BackgammonGameState,
  player: 0 | 1
): number => {
  return gameState.bearOff[player];
};

/**
 * Get checker count summary for a player
 */
export const getCheckerSummary = (
  gameState: BackgammonGameState,
  player: 0 | 1
) => {
  const onBoard = getCheckersOnBoard(gameState, player);
  const atHome = getCheckersAtHome(gameState, player);
  const bornOff = getCheckersBornOff(gameState, player);

  return {
    onBoard,
    atHome,
    bornOff,
    total: onBoard + bornOff, // Should always be 15 for each player
  };
};
