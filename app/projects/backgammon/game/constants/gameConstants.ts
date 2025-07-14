import { BackgammonGameState } from "../types";

export const INITIAL_BOARD_STATE: BackgammonGameState = {
  board: [
    0, // index 0 - unused
    2, // point 1 - player 0 (white) has 2 pieces
    0,
    0,
    0,
    0,
    -5, // point 6 - player 1 (black) has 5 pieces
    0,
    -3, // point 8 - player 1 (black) has 3 pieces
    0,
    0,
    0,
    5, // point 12 - player 0 (white) has 5 pieces
    -5, // point 13 - player 1 (black) has 5 pieces
    0,
    0,
    0,
    3, // point 17 - player 0 (white) has 3 pieces
    0,
    5, // point 19 - player 0 (white) has 5 pieces
    0,
    0,
    0,
    0,
    -2, // point 24 - player 1 (black) has 2 pieces
  ],
  currentPlayer: 1,
  dice: [], // Changed from [0, 0] to [] for the new dice system
  rolled: false,
  phase: "playing",
  winner: null,
  bar: [0, 0],
  bearOff: [0, 0],
  moveCount: 0,
  lastMove: null,
};

export const GAME_CONFIG = {
  AI_MOVE_DELAY: 1500,
  AI_DICE_DELAY: 1000,
  NO_MOVES_MESSAGE_DURATION: 1800,
  SOCKET_PATH: "/api/socket/backgammon",
} as const;

export const PLAYERS = {
  HUMAN: 0,
  AI: 1,
} as const;

export const BOARD_POINTS = {
  MIN: 1,
  MAX: 24,
  BAR: 0,
  BEAR_OFF: 25,
} as const;
