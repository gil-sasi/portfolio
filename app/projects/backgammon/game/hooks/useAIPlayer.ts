import { useCallback } from "react";
import { BackgammonGameState } from "../types";
import {
  canBearOffFromPoint,
  isValidMoveDestination,
} from "../utils/gameLogic";
import { checkForVictory, createVictoryState } from "../utils/gameStateManager";

export const useAIPlayer = (aiPlayerIndex: 0 | 1) => {
  const handleNormalMoves = useCallback((
    gameState: BackgammonGameState,
    validDiceValues: number[],
    aiPlayerIndex: 0 | 1
  ): BackgammonGameState => {
    // Find AI pieces based on player index
    const aiPieces: number[] = [];
    for (let i = 1; i <= 24; i++) {
      const pieces = gameState.board[i];
      if (
        (aiPlayerIndex === 0 && pieces > 0) ||
        (aiPlayerIndex === 1 && pieces < 0)
      ) {
        aiPieces.push(i);
      }
    }

    if (aiPieces.length === 0) {
      console.log("AI: No AI pieces found on board");
      const humanPlayerIndex = aiPlayerIndex === 0 ? 1 : 0;
      return {
        ...gameState,
        currentPlayer: humanPlayerIndex as 0 | 1,
        rolled: false,
        dice: [0, 0] as [number, number],
        lastMove: "AI has no pieces - your turn!",
      };
    }

    // Sort AI pieces by priority (prefer pieces closer to home for better strategy)
    aiPieces.sort((a, b) => b - a);
    console.log("AI: Available pieces at points:", aiPieces);
    console.log("AI: Available dice:", validDiceValues);

    // Try to make a move with available dice
    for (const die of validDiceValues) {
      for (const fromPoint of aiPieces) {
        // Movement direction depends on player index
        // Player 0 (White) moves from higher to lower numbers (towards home 1-6)
        // Player 1 (Black) moves from lower to higher numbers (towards home 19-24)
        const toPoint = aiPlayerIndex === 0 ? fromPoint - die : fromPoint + die;

        console.log(
          `AI: Trying to move from ${fromPoint} to ${toPoint} with die ${die}`
        );

        // Check for bearing off move first
        const canBearOff =
          aiPlayerIndex === 0
            ? toPoint <= 0 &&
              canBearOffFromPoint(gameState, fromPoint, die, aiPlayerIndex)
            : toPoint >= 25 &&
              canBearOffFromPoint(gameState, fromPoint, die, aiPlayerIndex);

        if (canBearOff) {
          return handleBearOffMove(gameState, fromPoint, die, aiPlayerIndex);
        }

        // Regular move
        const validToPoint = aiPlayerIndex === 0 ? toPoint >= 1 : toPoint <= 24;
        if (validToPoint) {
          const moveResult = handleRegularMove(
            gameState,
            fromPoint,
            toPoint,
            die,
            aiPlayerIndex
          );
          if (moveResult) return moveResult;
        }
      }
    }

    // If no valid moves, switch turn
    console.log("AI: No valid moves available - switching turn");
    const humanPlayerIndex = aiPlayerIndex === 0 ? 1 : 0;
    return {
      ...gameState,
      currentPlayer: humanPlayerIndex as 0 | 1,
      rolled: false,
      dice: [0, 0] as [number, number],
      lastMove: "AI had no valid moves - your turn!",
    };
  }, []);

  const makeAIMove = useCallback(
    (gameState: BackgammonGameState): BackgammonGameState => {
      // Add validation to ensure aiPlayerIndex is correct
      if (aiPlayerIndex !== 0 && aiPlayerIndex !== 1) {
        console.error("Invalid AI player index:", aiPlayerIndex);
        return gameState;
      }

      const validDiceValues = gameState.dice.filter((die) => die > 0);
      const humanPlayerIndex = aiPlayerIndex === 0 ? 1 : 0;

      if (validDiceValues.length === 0) {
        console.log("AI: No valid dice values");
        return {
          ...gameState,
          currentPlayer: humanPlayerIndex as 0 | 1,
          rolled: false,
          dice: [],
          lastMove: "AI turn ended - your turn!",
        };
      }

      // Check if AI has pieces on the bar
      const aiBarPieces = gameState.bar[aiPlayerIndex];
      console.log("AI: Bar pieces:", aiBarPieces);

      if (aiBarPieces > 0) {
        return handleBarMoves(gameState, validDiceValues, aiPlayerIndex);
      }

      // If no bar pieces, proceed with normal moves
      return handleNormalMoves(gameState, validDiceValues, aiPlayerIndex);
    },
    [aiPlayerIndex, handleNormalMoves]
  );

  const handleBarMoves = (
    gameState: BackgammonGameState,
    validDiceValues: number[],
    aiPlayerIndex: 0 | 1
  ): BackgammonGameState => {
    console.log("AI: Must move pieces from bar first");

    for (const die of validDiceValues) {
      // AI enters into opponent's home board
      // Player 0 (White) enters into Black's home board (19-24)
      // Player 1 (Black) enters into White's home board (1-6)
      const entryPoint = aiPlayerIndex === 0 ? 25 - die : die;

      if (entryPoint >= 1 && entryPoint <= 24) {
        const toPieces = gameState.board[entryPoint];

        // Check if AI can enter at this point
        const canEnter = isValidMoveDestination(toPieces, aiPlayerIndex);

        if (canEnter) {
          console.log(`AI: Entering from bar to point ${entryPoint}`);

          // Make the move
          const newBoard = [...gameState.board];
          const newBar: [number, number] = [...gameState.bar];

          // Remove piece from bar
          newBar[aiPlayerIndex] = newBar[aiPlayerIndex] - 1;

          // Place piece at entry point
          if (toPieces === 0) {
            newBoard[entryPoint] = aiPlayerIndex === 0 ? 1 : -1; // Place AI piece
          } else if (
            (aiPlayerIndex === 0 && toPieces > 0) ||
            (aiPlayerIndex === 1 && toPieces < 0)
          ) {
            newBoard[entryPoint] =
              aiPlayerIndex === 0 ? toPieces + 1 : toPieces - 1; // Stack with own pieces
          } else {
            // Capture opponent piece
            const capturedPlayer = aiPlayerIndex === 0 ? 1 : 0;
            newBar[capturedPlayer] = newBar[capturedPlayer] + 1;
            newBoard[entryPoint] = aiPlayerIndex === 0 ? 1 : -1; // Place AI piece
          }

          // Remove used die
          const newDice = [...gameState.dice];
          const diceIndex = newDice.indexOf(die);
          if (diceIndex !== -1) {
            newDice[diceIndex] = 0;
          }

          const remainingDice = newDice.filter((d) => d > 0);
          const shouldSwitchTurn = remainingDice.length === 0;

          const moveDescription =
            toPieces > 0
              ? `AI entered from bar to point ${entryPoint} and captured your piece!`
              : `AI entered from bar to point ${entryPoint}`;

          console.log(`AI: ${moveDescription}`);

          const humanPlayerIndex = aiPlayerIndex === 0 ? 1 : 0;
          const newGameState = {
            ...gameState,
            board: newBoard,
            bar: newBar,
            dice: newDice,
            currentPlayer: shouldSwitchTurn
              ? (humanPlayerIndex as 0 | 1)
              : (aiPlayerIndex as 0 | 1),
            rolled: !shouldSwitchTurn,
            moveCount: gameState.moveCount + 1,
            lastMove: moveDescription,
          };

          // Check for victory after the move
          const winner = checkForVictory(newGameState);
          if (winner !== null) {
            return createVictoryState(newGameState, winner);
          }

          return newGameState;
        }
      }
    }

    // If no valid bar moves, AI is blocked
    console.log("AI: No valid moves from bar - switching turn");
    const humanPlayerIndex = aiPlayerIndex === 0 ? 1 : 0;
    return {
      ...gameState,
      currentPlayer: humanPlayerIndex as 0 | 1,
      rolled: false,
      dice: [0, 0] as [number, number],
      lastMove: "AI blocked on bar - your turn!",
    };
  };

  const handleBearOffMove = (
    gameState: BackgammonGameState,
    fromPoint: number,
    die: number,
    aiPlayerIndex: 0 | 1
  ): BackgammonGameState => {
    console.log(`AI: Valid bearing off move found - ${fromPoint} to bear off`);

    const newBoard = [...gameState.board];
    const newBar: [number, number] = [...gameState.bar];
    const newBearOff: [number, number] = [...gameState.bearOff];

    // Remove AI piece from source
    if (aiPlayerIndex === 0) {
      newBoard[fromPoint] = newBoard[fromPoint] - 1; // Make less positive (remove piece)
    } else {
      newBoard[fromPoint] = newBoard[fromPoint] + 1; // Make less negative (remove piece)
    }

    // Add to bear off area
    newBearOff[aiPlayerIndex] = newBearOff[aiPlayerIndex] + 1;

    // Remove used die
    const newDice = [...gameState.dice];
    const diceIndex = newDice.indexOf(die);
    if (diceIndex !== -1) {
      newDice[diceIndex] = 0;
    }

    const remainingDice = newDice.filter((d) => d > 0);
    const shouldSwitchTurn = remainingDice.length === 0;
    const humanPlayerIndex = aiPlayerIndex === 0 ? 1 : 0;

    const moveDescription = `AI bore off from point ${fromPoint}`;
    console.log(`AI: ${moveDescription}`);

    const newGameState = {
      ...gameState,
      board: newBoard,
      bar: newBar,
      bearOff: newBearOff,
      dice: newDice,
      currentPlayer: shouldSwitchTurn
        ? humanPlayerIndex
        : (aiPlayerIndex as 0 | 1),
      rolled: !shouldSwitchTurn,
      moveCount: gameState.moveCount + 1,
      lastMove: moveDescription,
    };

    // Check for victory after the move
    const winner = checkForVictory(newGameState);
    if (winner !== null) {
      return createVictoryState(newGameState, winner);
    }

    return newGameState;
  };

  const handleRegularMove = (
    gameState: BackgammonGameState,
    fromPoint: number,
    toPoint: number,
    die: number,
    aiPlayerIndex: 0 | 1
  ): BackgammonGameState | null => {
    const fromPieces = gameState.board[fromPoint];
    const toPieces = gameState.board[toPoint];

    // Validate AI has pieces at fromPoint
    const hasAIPieces = aiPlayerIndex === 0 ? fromPieces > 0 : fromPieces < 0;
    if (!hasAIPieces) {
      console.log(
        `AI: No AI pieces at point ${fromPoint} (pieces: ${fromPieces}, AI is player ${aiPlayerIndex})`
      );
      return null;
    }

    // Check if destination is valid for AI
    const canMoveTo = isValidMoveDestination(toPieces, aiPlayerIndex);

    if (canMoveTo) {
      console.log(`AI: Valid move found - ${fromPoint} to ${toPoint}`);

      // Make the move
      const newBoard = [...gameState.board];
      const newBar: [number, number] = [...gameState.bar];

      // Remove AI piece from source
      if (aiPlayerIndex === 0) {
        newBoard[fromPoint] = newBoard[fromPoint] - 1; // Make less positive (remove piece)
      } else {
        newBoard[fromPoint] = newBoard[fromPoint] + 1; // Make less negative (remove piece)
      }

      // Place AI piece at destination
      if (toPieces === 0) {
        newBoard[toPoint] = aiPlayerIndex === 0 ? 1 : -1; // Place AI piece
      } else if (
        (aiPlayerIndex === 0 && toPieces > 0) ||
        (aiPlayerIndex === 1 && toPieces < 0)
      ) {
        // Stack with own pieces
        newBoard[toPoint] = aiPlayerIndex === 0 ? toPieces + 1 : toPieces - 1;
      } else {
        // Capture opponent piece and add to bar
        const capturedPlayer = aiPlayerIndex === 0 ? 1 : 0;
        newBar[capturedPlayer] = newBar[capturedPlayer] + 1;
        newBoard[toPoint] = aiPlayerIndex === 0 ? 1 : -1; // Place AI piece
      }

      // Remove used die
      const newDice = [...gameState.dice];
      const diceIndex = newDice.indexOf(die);
      if (diceIndex !== -1) {
        newDice[diceIndex] = 0;
      }

      const remainingDice = newDice.filter((d) => d > 0);
      const shouldSwitchTurn = remainingDice.length === 0;
      const humanPlayerIndex = aiPlayerIndex === 0 ? 1 : 0;

      // Check if a piece was captured
      const pieceCaptured =
        (aiPlayerIndex === 0 && toPieces < 0) ||
        (aiPlayerIndex === 1 && toPieces > 0);

      const moveDescription = pieceCaptured
        ? `AI moved from ${fromPoint} to ${toPoint} and captured your piece!`
        : `AI moved from ${fromPoint} to ${toPoint}`;

      console.log(`AI: ${moveDescription}`);

      const newGameState = {
        ...gameState,
        board: newBoard,
        bar: newBar,
        dice: newDice,
        currentPlayer: shouldSwitchTurn
          ? humanPlayerIndex
          : (aiPlayerIndex as 0 | 1),
        rolled: !shouldSwitchTurn,
        moveCount: gameState.moveCount + 1,
        lastMove: moveDescription,
      };

      // Check for victory after the move
      const winner = checkForVictory(newGameState);
      if (winner !== null) {
        return createVictoryState(newGameState, winner);
      }

      return newGameState;
    } else {
      console.log(`AI: Invalid destination ${toPoint} - pieces: ${toPieces}`);
      return null;
    }
  };

  return {
    makeAIMove,
  };
};
