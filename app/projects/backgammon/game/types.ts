export interface Player {
  id: string;
  name: string;
  socketId: string;
  isReady: boolean;
  inGame: boolean;
}

export interface BackgammonGameState {
  board: number[];
  currentPlayer: 0 | 1;
  dice: number[]; // Changed from [number, number] to number[] to handle doubles
  rolled: boolean;
  phase: "setup" | "playing" | "finished";
  winner: number | null;
  bar: [number, number]; // pieces on the bar for each player
  bearOff: [number, number]; // pieces bearing off for each player
  moveCount: number;
  lastMove: string | null;
  doublingCube?: {
    value: number; // 2, 4, 8, 16, 32, 64
    owner: 0 | 1 | null; // who can offer the next double (null = both can offer)
  };
}

export interface Move {
  from: number;
  to: number;
  player: 0 | 1;
}

export interface GameRoom {
  id: string;
  players: [Player, Player];
  gameState: BackgammonGameState;
  spectators: Player[];
  createdAt: Date;
}

export interface Challenge {
  from: Player;
  challengeId: string;
}

export interface Point {
  index: number;
  count: number;
  player: 0 | 1 | null;
}

export interface BoardPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}
