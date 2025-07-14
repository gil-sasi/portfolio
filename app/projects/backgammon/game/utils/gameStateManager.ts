import { BackgammonGameState } from "../types";
import {
  canBearOffFromPoint,
  getValidDiceValues,
  isValidMoveDestination,
} from "./gameLogic";
import { INITIAL_BOARD_STATE } from "../constants/gameConstants";

export const resetGameState = (
  setGameState: React.Dispatch<React.SetStateAction<BackgammonGameState | null>>
): void => {
  setGameState({ ...INITIAL_BOARD_STATE });
};

export const rollDice = (): [number, number] => {
  const dice1 = Math.floor(Math.random() * 6) + 1;
  const dice2 = Math.floor(Math.random() * 6) + 1;
  return [dice1, dice2];
};

// New function to create the dice state that properly handles doubles
export const createDiceState = (dice1: number, dice2: number): number[] => {
  if (dice1 === dice2) {
    // For doubles, return 4 dice of the same value
    return [dice1, dice1, dice1, dice1];
  } else {
    // For regular rolls, return 2 dice
    return [dice1, dice2];
  }
};

export const hasValidMoves = (
  state: BackgammonGameState,
  playerIdx: number
): boolean => {
  if (!state.rolled) return false;

  const validDiceValues = getValidDiceValues(state);

  // Check for bar pieces first
  if (state.bar[playerIdx] > 0) {
    for (const die of validDiceValues) {
      // Player enters into opponent's home board
      // Player 0 (White) enters into Black's home board (19-24)
      // Player 1 (Black) enters into White's home board (1-6)
      const entryPoint = playerIdx === 0 ? 25 - die : die;
      if (entryPoint >= 1 && entryPoint <= 24) {
        const toPieces = state.board[entryPoint];
        if (isValidMoveDestination(toPieces, playerIdx)) {
          return true;
        }
      }
    }
    return false; // If pieces on bar but no valid entry moves, no other moves allowed
  }

  // Check board pieces only if no bar pieces
  for (let point = 1; point <= 24; point++) {
    const pieces = state.board[point];
    if ((playerIdx === 0 && pieces < 0) || (playerIdx === 1 && pieces > 0))
      continue;
    if ((playerIdx === 0 && pieces > 0) || (playerIdx === 1 && pieces < 0)) {
      for (const die of validDiceValues) {
        // Player 0 (White) moves towards lower numbers (towards home 1-6)
        // Player 1 (Black) moves towards higher numbers (towards home 19-24)
        const toPoint = playerIdx === 0 ? point - die : point + die;
        if (toPoint >= 1 && toPoint <= 24) {
          const toPieces = state.board[toPoint];
          if (isValidMoveDestination(toPieces, playerIdx)) {
            return true;
          }
        }

        // Check for bearing off moves
        if (canBearOffFromPoint(state, point, die, playerIdx)) {
          return true;
        }
      }
    }
  }
  return false;
};

export const switchPlayer = (currentPlayer: 0 | 1): 0 | 1 => {
  return currentPlayer === 0 ? 1 : 0;
};

export const createGameEndState = (
  gameState: BackgammonGameState,
  message: string
): BackgammonGameState => {
  return {
    ...gameState,
    currentPlayer: 0 as 0 | 1,
    rolled: false,
    dice: [],
    lastMove: message,
  };
};

export const checkForVictory = (
  gameState: BackgammonGameState
): number | null => {
  // In backgammon, a player wins when they bear off all 15 pieces
  const TOTAL_PIECES = 15;

  console.log("Checking for victory:", {
    player0BearOff: gameState.bearOff[0],
    player1BearOff: gameState.bearOff[1],
    phase: gameState.phase,
  });

  // Check if player 0 has won
  if (gameState.bearOff[0] === TOTAL_PIECES) {
    console.log("Player 0 (White) has won!");
    return 0;
  }

  // Check if player 1 has won
  if (gameState.bearOff[1] === TOTAL_PIECES) {
    console.log("Player 1 (Black) has won!");
    return 1;
  }

  return null; // No winner yet
};

// Enhanced victory detection with gammon/backgammon scoring
export const checkForVictoryWithScoring = (
  gameState: BackgammonGameState
): {
  winner: number;
  score: number;
  type: "normal" | "gammon" | "backgammon";
} | null => {
  const TOTAL_PIECES = 15;

  // Check if player 0 has won
  if (gameState.bearOff[0] === TOTAL_PIECES) {
    const opponentBornOff = gameState.bearOff[1];
    const opponentOnBar = gameState.bar[1];

    // Check if opponent has pieces in player 0's home board (points 1-6)
    let opponentInWinnerHome = false;
    for (let i = 1; i <= 6; i++) {
      if (gameState.board[i] < 0) {
        // Player 1 pieces are negative
        opponentInWinnerHome = true;
        break;
      }
    }

    if (opponentBornOff === 0) {
      if (opponentOnBar > 0 || opponentInWinnerHome) {
        return { winner: 0, score: 3, type: "backgammon" };
      } else {
        return { winner: 0, score: 2, type: "gammon" };
      }
    } else {
      return { winner: 0, score: 1, type: "normal" };
    }
  }

  // Check if player 1 has won
  if (gameState.bearOff[1] === TOTAL_PIECES) {
    const opponentBornOff = gameState.bearOff[0];
    const opponentOnBar = gameState.bar[0];

    // Check if opponent has pieces in player 1's home board (points 19-24)
    let opponentInWinnerHome = false;
    for (let i = 19; i <= 24; i++) {
      if (gameState.board[i] > 0) {
        // Player 0 pieces are positive
        opponentInWinnerHome = true;
        break;
      }
    }

    if (opponentBornOff === 0) {
      if (opponentOnBar > 0 || opponentInWinnerHome) {
        return { winner: 1, score: 3, type: "backgammon" };
      } else {
        return { winner: 1, score: 2, type: "gammon" };
      }
    } else {
      return { winner: 1, score: 1, type: "normal" };
    }
  }

  return null; // No winner yet
};

export const createVictoryState = (
  gameState: BackgammonGameState,
  winner: number
): BackgammonGameState => {
  console.log("Creating victory state:", {
    winner,
    phase: "finished",
    bearOff: gameState.bearOff,
  });

  return {
    ...gameState,
    phase: "finished",
    winner,
    rolled: false,
    dice: [],
    lastMove: `Player ${winner === 0 ? "White" : "Black"} wins!`,
  };
};
