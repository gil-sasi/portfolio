"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { io, Socket } from "socket.io-client";
import BackgammonBoard from "./components/BackgammonBoard";
import GameInfo from "./components/GameInfo";
import { BackgammonGameState, Player, Move } from "./types";
import {
  canBearOffFromPoint,
  getValidDiceValues,
  isValidMoveDestination,
} from "./utils/gameLogic";
import { useAIPlayer } from "./hooks/useAIPlayer";
import {
  resetGameState,
  rollDice,
  createDiceState,
  hasValidMoves,
  switchPlayer,
  createGameEndState,
  checkForVictory,
  createVictoryState,
} from "./utils/gameStateManager";
import { INITIAL_BOARD_STATE, GAME_CONFIG } from "./constants/gameConstants";

export default function BackgammonGame() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  // State management
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<BackgammonGameState | null>(null);
  const [players, setPlayers] = useState<[Player, Player] | null>(null);
  const [playerIndex, setPlayerIndex] = useState<number | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [gameMode, setGameMode] = useState<"online" | "offline">("online");
  const [showTutorial, setShowTutorial] = useState(true);
  const [noMovesMessage, setNoMovesMessage] = useState<string | null>(null);
  const [gameStartTime, setGameStartTime] = useState<Date | null>(null);
  const initializedRef = useRef(false);

  // AI player hook - determine AI player index
  const aiPlayerIndex = playerIndex === 0 ? 1 : 0;
  const { makeAIMove } = useAIPlayer(aiPlayerIndex as 0 | 1);

  // Function to save score to database
  const saveScoreToDatabase = useCallback(
    async (gameState: BackgammonGameState) => {
      if (
        !gameState.winner ||
        !gameStartTime ||
        !players ||
        playerIndex === null
      )
        return;

      const gameEndTime = new Date();
      const gameDuration = Math.round(
        (gameEndTime.getTime() - gameStartTime.getTime()) / 1000
      ); // in seconds

      const playerName = players[playerIndex]?.name || "Player";
      const opponentName = players[aiPlayerIndex]?.name || "AI";
      const winner = gameState.winner === playerIndex ? "player" : "opponent";

      try {
        const response = await fetch("/api/backgammon/scores", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            playerName,
            opponentName,
            winner,
            gameMode: "offline",
            gameDuration,
            moveCount: gameState.moveCount,
            playerSocketId: null,
            gameRoomId: null,
          }),
        });

        if (response.ok) {
          console.log("Score saved successfully!");
        } else {
          console.error("Failed to save score:", response.statusText);
        }
      } catch (error) {
        console.error("Error saving score:", error);
      }
    },
    [gameStartTime, players, playerIndex, aiPlayerIndex]
  );

  const initializeSocket = useCallback(async () => {
    try {
      const mode = searchParams?.get("mode");
      const room = searchParams?.get("roomId");

      if (mode === "offline") {
        setGameMode("offline");
        setIsConnecting(false);

        // Always make human player White (Player 0) for consistency
        const humanPlayerIndex = 0;
        const aiPlayerIndex = 1;

        setGameState({
          ...INITIAL_BOARD_STATE,
          currentPlayer: humanPlayerIndex as 0 | 1, // Human starts first
        });

        // Set up players array - AI and human positions are randomized
        const players: [Player, Player] = [
          {
            id: "placeholder",
            name: "Placeholder",
            socketId: "placeholder",
            isReady: true,
            inGame: true,
          },
          {
            id: "placeholder2",
            name: "Placeholder2",
            socketId: "placeholder2",
            isReady: true,
            inGame: true,
          },
        ];

        players[aiPlayerIndex] = {
          id: "ai",
          name: "AI",
          socketId: "ai",
          isReady: true,
          inGame: true,
        };
        players[humanPlayerIndex] = {
          id: "player1",
          name: searchParams?.get("name") || "You",
          socketId: "player1",
          isReady: true,
          inGame: true,
        };

        setPlayers(players);
        setPlayerIndex(humanPlayerIndex);
        setGameStartTime(new Date());
        return;
      }

      if (!room) {
        router.push("/projects/backgammon");
        return;
      }

      setRoomId(room);
      await fetch(GAME_CONFIG.SOCKET_PATH);
      const newSocket = io({
        path: GAME_CONFIG.SOCKET_PATH,
        forceNew: true,
      });

      newSocket.on("connect", () => {
        console.log("Connected to game server");
        setConnected(true);
        setIsConnecting(false);
        newSocket.emit("join-game", { roomId: room });
      });

      newSocket.on("game-state", (state) => {
        setGameState(state.gameState);
        setPlayers(state.players);
        setPlayerIndex(
          state.players.findIndex((p: Player) => p.socketId === newSocket.id)
        );
      });

      newSocket.on("dice-rolled", ({ dice, player, gameState: newState }) => {
        setGameState(newState);
      });

      newSocket.on(
        "move-made",
        ({ move, playerIndex: movePlayer, gameState: newState }) => {
          setGameState(newState);
        }
      );

      newSocket.on("game-ended", ({ winner, reason }) => {
        alert(`Game ended! Winner: Player ${winner + 1} (${reason})`);
        setTimeout(() => {
          router.push("/projects/backgammon");
        }, 3000);
      });

      newSocket.on("disconnect", () => {
        console.log("Disconnected from game server");
        setConnected(false);
      });

      setSocket(newSocket);
    } catch (error) {
      console.error("Failed to initialize socket:", error);
      setIsConnecting(false);
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    initializeSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [initializeSocket]);

  // Auto-trigger AI turn when it's AI's turn and not rolled
  useEffect(() => {
    if (
      gameMode === "offline" &&
      gameState &&
      gameState.currentPlayer === aiPlayerIndex &&
      !gameState.rolled &&
      gameState.phase === "playing"
    ) {
      console.log("Auto-triggering AI turn");

      setTimeout(() => {
        setGameState((prev) => {
          if (!prev || prev.currentPlayer !== aiPlayerIndex || prev.rolled)
            return prev;

          const [dice1, dice2] = rollDice();
          const diceArray = createDiceState(dice1, dice2);
          console.log(
            `AI auto-rolled: ${dice1}, ${dice2}${
              dice1 === dice2 ? " (doubles!)" : ""
            }`
          );

          return {
            ...prev,
            dice: diceArray,
            rolled: true,
            lastMove: `AI rolled ${dice1}, ${dice2}${
              dice1 === dice2 ? " (doubles!)" : ""
            }`,
          };
        });
      }, GAME_CONFIG.AI_DICE_DELAY);
    }
  }, [
    gameMode,
    gameState?.currentPlayer,
    gameState?.rolled,
    gameState?.phase,
    aiPlayerIndex,
  ]);

  // Auto-process AI moves when AI has rolled dice
  useEffect(() => {
    if (
      gameMode === "offline" &&
      gameState &&
      gameState.currentPlayer === aiPlayerIndex &&
      gameState.rolled &&
      gameState.dice.some((d) => d > 0)
    ) {
      console.log("Auto-processing AI moves");

      const processAIMoves = () => {
        setGameState((currentState) => {
          if (
            !currentState ||
            currentState.currentPlayer !== aiPlayerIndex ||
            !currentState.rolled
          ) {
            console.log("AI: Skipping AI move - conditions not met", {
              hasState: !!currentState,
              currentPlayer: currentState?.currentPlayer,
              rolled: currentState?.rolled,
            });
            return currentState;
          }

          const remainingDice = currentState.dice.filter((d) => d > 0);
          console.log("AI: Processing move with dice:", remainingDice);

          if (remainingDice.length === 0) {
            console.log("AI: No remaining dice, ending turn");
            return createGameEndState(
              currentState,
              currentState.lastMove + " - Your turn!"
            );
          }

          console.log("AI: Making move...");
          const newState = makeAIMove(currentState);
          console.log("AI: Move completed, new state:", {
            currentPlayer: newState.currentPlayer,
            dice: newState.dice,
            lastMove: newState.lastMove,
          });
          return newState;
        });
      };

      const timer = setTimeout(processAIMoves, GAME_CONFIG.AI_MOVE_DELAY);
      return () => clearTimeout(timer);
    }
  }, [
    gameMode,
    gameState?.currentPlayer,
    gameState?.rolled,
    gameState?.dice,
    makeAIMove,
    aiPlayerIndex,
  ]);

  // Save score when game ends
  useEffect(() => {
    if (
      gameMode === "offline" &&
      gameState?.phase === "finished" &&
      gameState?.winner !== null &&
      gameStartTime
    ) {
      saveScoreToDatabase(gameState);
    }
  }, [
    gameMode,
    gameState?.phase,
    gameState?.winner,
    saveScoreToDatabase,
    gameStartTime,
  ]);

  const handleRollDice = useCallback(() => {
    if (gameMode === "offline") {
      if (
        gameState &&
        !gameState.rolled &&
        gameState.currentPlayer === playerIndex
      ) {
        const [dice1, dice2] = rollDice();
        const diceArray = createDiceState(dice1, dice2);

        setGameState((prev: BackgammonGameState | null) => {
          if (!prev) return null;
          const nextState = {
            ...prev,
            dice: diceArray,
            rolled: true,
          };

          if (!hasValidMoves(nextState, playerIndex!)) {
            setNoMovesMessage("No valid moves, your turn is skipped.");
            setTimeout(() => {
              setGameState((skipState: BackgammonGameState | null) =>
                skipState
                  ? {
                      ...skipState,
                      currentPlayer: switchPlayer(skipState.currentPlayer),
                      rolled: false,
                      dice: [],
                      lastMove: "No valid moves, turn skipped.",
                    }
                  : null
              );
              setNoMovesMessage(null);
            }, GAME_CONFIG.NO_MOVES_MESSAGE_DURATION);
          }
          return nextState;
        });
      }
    } else {
      if (
        socket &&
        connected &&
        roomId &&
        gameState &&
        !gameState.rolled &&
        gameState.currentPlayer === playerIndex
      ) {
        socket.emit("roll-dice", { roomId });
      }
    }
  }, [socket, connected, roomId, gameState, playerIndex, gameMode]);

  const handleNoValidMoves = useCallback(() => {
    if (gameMode === "offline" && gameState && playerIndex !== null) {
      setNoMovesMessage("No valid moves available, your turn is skipped.");
      setTimeout(() => {
        setGameState((skipState: BackgammonGameState | null) =>
          skipState
            ? {
                ...skipState,
                currentPlayer: switchPlayer(skipState.currentPlayer),
                rolled: false,
                dice: [],
                lastMove: "No valid moves, turn skipped.",
              }
            : null
        );
        setNoMovesMessage(null);
      }, GAME_CONFIG.NO_MOVES_MESSAGE_DURATION);
    }
  }, [gameMode, gameState, playerIndex]);

  const handleMove = useCallback(
    (move: Move) => {
      if (
        !gameState ||
        gameState.currentPlayer !== playerIndex ||
        !gameState.rolled
      ) {
        return;
      }

      // Validate move
      if (move.from < 0 || move.from > 24 || move.to < 1 || move.to > 25) {
        return;
      }

      // Check bar rule
      const playerBarPieces = gameState.bar[move.player];
      if (playerBarPieces > 0 && move.from !== 0) {
        alert(
          "You must move your pieces from the bar before making other moves!"
        );
        return;
      }

      // Validate move distance
      let moveDistance: number = 0;
      const validDiceValues = getValidDiceValues(gameState);

      if (move.from === 0) {
        // For bar moves, calculate the actual die value needed
        // Player 0 (White) enters into Black's home board (19-24): distance = 25 - move.to
        // Player 1 (Black) enters into White's home board (1-6): distance = move.to
        moveDistance = move.player === 0 ? 25 - move.to : move.to;
        if (gameState.bar[move.player] === 0) {
          alert("You don't have any pieces on the bar!");
          return;
        }
      } else if (move.to === 25) {
        const validBearOffMove = validDiceValues.some((die) =>
          canBearOffFromPoint(gameState, move.from, die, move.player)
        );
        if (!validBearOffMove) {
          console.log(`Bear-off attempt failed:`, {
            fromPoint: move.from,
            player: move.player,
            playerIndex,
            currentPlayer: gameState.currentPlayer,
            playerHomeBoard: move.player === 0 ? "1-6" : "19-24",
            validDiceValues,
            isInHomeBoard:
              move.player === 0
                ? move.from >= 1 && move.from <= 6
                : move.from >= 19 && move.from <= 24,
          });
          alert("You cannot bear off from this point with the available dice!");
          return;
        }
        for (const die of validDiceValues) {
          if (canBearOffFromPoint(gameState, move.from, die, move.player)) {
            moveDistance = die;
            break;
          }
        }
      } else {
        moveDistance = Math.abs(move.to - move.from);
      }

      if (!validDiceValues.includes(moveDistance)) {
        alert(
          `Invalid move! You can only move ${validDiceValues.join(
            " or "
          )} spaces. You tried to move ${moveDistance} spaces.`
        );
        return;
      }

      // Validate direction
      if (move.from !== 0 && move.to !== 25) {
        // White (Player 0) moves towards lower numbers (towards home 1-6)
        // Black (Player 1) moves towards higher numbers (towards home 19-24)
        const expectedDirection = move.player === 0 ? -1 : 1;
        const actualDirection = move.to - move.from;
        if (Math.sign(actualDirection) !== expectedDirection) {
          alert(
            `Invalid direction! ${
              move.player === 0 ? "White" : "Black"
            } pieces must move ${
              move.player === 0 ? "towards points 1-6" : "towards points 19-24"
            }.`
          );
          return;
        }
      }

      // Validate destination is legal for landing on
      if (move.to !== 25) {
        const toPieces = gameState.board[move.to];
        const isValidDestination = isValidMoveDestination(
          toPieces,
          move.player
        );
        if (!isValidDestination) {
          const opponentPieces = Math.abs(toPieces);
          alert(
            `Invalid move! You cannot land on a point with ${opponentPieces} opponent pieces. You can only capture a single opponent piece (blot).`
          );
          return;
        }
      }

      if (gameMode === "offline") {
        setGameState((prev: BackgammonGameState | null) => {
          if (!prev) return null;

          const newBoard = [...prev.board];
          const newBar: [number, number] = [...prev.bar];
          const newBearOff: [number, number] = [...prev.bearOff];
          const toPieces = move.to === 25 ? 0 : newBoard[move.to];

          // Remove piece from source
          if (move.from === 0) {
            newBar[move.player] = newBar[move.player] - 1;
          } else {
            if (move.player === 0) {
              newBoard[move.from] = newBoard[move.from] - 1;
            } else {
              newBoard[move.from] = newBoard[move.from] + 1;
            }
          }

          // Place piece at destination
          if (move.to === 25) {
            newBearOff[move.player] = newBearOff[move.player] + 1;
          } else if (toPieces === 0) {
            newBoard[move.to] = move.player === 0 ? 1 : -1;
          } else if (
            (move.player === 0 && toPieces > 0) ||
            (move.player === 1 && toPieces < 0)
          ) {
            newBoard[move.to] = move.player === 0 ? toPieces + 1 : toPieces - 1;
          } else {
            // Capture
            const capturedPlayer = toPieces > 0 ? 0 : 1;
            newBar[capturedPlayer] = newBar[capturedPlayer] + 1;
            newBoard[move.to] = move.player === 0 ? 1 : -1;
          }

          // Update dice
          const newDice = [...prev.dice];
          const diceIndex = newDice.indexOf(moveDistance);
          if (diceIndex !== -1) {
            newDice[diceIndex] = 0;
          }

          const remainingDice = newDice.filter((d) => d > 0);
          const shouldSwitchTurn = remainingDice.length === 0;

          const newGameState = {
            ...prev,
            board: newBoard,
            bar: newBar,
            bearOff: newBearOff,
            dice: newDice,
            currentPlayer: shouldSwitchTurn
              ? switchPlayer(prev.currentPlayer)
              : prev.currentPlayer,
            rolled: !shouldSwitchTurn,
            moveCount: prev.moveCount + 1,
            lastMove: `Player ${move.player} moved from ${move.from} to ${move.to}`,
          };

          // Check for victory after the move
          const winner = checkForVictory(newGameState);
          if (winner !== null) {
            return createVictoryState(newGameState, winner);
          }

          return newGameState;
        });
      }
    },
    [gameMode, gameState, playerIndex]
  );

  if (!gameState || !players) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading game...</p>
        </div>
      </div>
    );
  }

  // Debug logging for victory state
  console.log("Game state debug:", {
    phase: gameState.phase,
    winner: gameState.winner,
    bearOff: gameState.bearOff,
  });

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 animated-bg opacity-5"></div>
      <div className="absolute top-10 right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-orange-500/10 rounded-full blur-xl"></div>

      <div className="relative z-10 px-4 sm:px-6 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto">
          {/* Game Header */}
          <div className="mb-4">
            <GameInfo
              gameState={gameState}
              players={players}
              playerIndex={playerIndex}
              connected={connected}
              gameMode={gameMode}
              onRollDice={handleRollDice}
              onLeaveGame={() => router.push("/projects/backgammon")}
              onShowTutorial={() => setShowTutorial(true)}
              onResetGame={() => resetGameState(setGameState)}
            />
          </div>

          {/* Game Board */}
          <div className="modern-card p-2 sm:p-4 relative">
            {noMovesMessage && (
              <div className="mb-4 text-center text-lg font-semibold text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300 rounded p-2 shadow animate-pulse">
                {noMovesMessage}
              </div>
            )}

            <BackgammonBoard
              gameState={gameState}
              players={players}
              playerIndex={playerIndex}
              onMove={handleMove}
              onRollDice={handleRollDice}
              disabled={
                gameState.currentPlayer !== playerIndex ||
                gameState.phase !== "playing"
              }
              onNoValidMoves={handleNoValidMoves}
            />

            {/* Victory Overlay */}
            {(() => {
              console.log("Victory overlay check:", {
                phase: gameState.phase,
                winner: gameState.winner,
                shouldShow:
                  gameState.phase === "finished" && gameState.winner !== null,
              });
              return (
                gameState.phase === "finished" && gameState.winner !== null
              );
            })() && (
              <div className="absolute inset-0 bg-black bg-opacity-85 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-lg mx-4 text-center">
                  <div className="mb-6">
                    <div className="text-6xl mb-4">🏆</div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                      {gameState.winner === playerIndex
                        ? t("backgammon.victoryTitle", "Victory!")
                        : t("backgammon.defeatTitle", "Game Over")}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                      {gameState.winner === 0
                        ? t("backgammon.whiteWins", "White wins!")
                        : t("backgammon.blackWins", "Black wins!")}
                    </p>
                  </div>

                  <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                    <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                      {t("backgammon.finalScore", "Final Score")}
                    </h3>
                    <div className="flex justify-between text-sm">
                      <span>
                        {t(
                          "backgammon.whitePiecesBornOff",
                          "White pieces born off"
                        )}
                        : {gameState.bearOff[0]}/15
                      </span>
                      <span>
                        {t(
                          "backgammon.blackPiecesBornOff",
                          "Black pieces born off"
                        )}
                        : {gameState.bearOff[1]}/15
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        resetGameState(setGameState);
                        setGameStartTime(new Date());
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                      {t("backgammon.playAgain", "Play Again")}
                    </button>
                    <button
                      onClick={() => router.push("/projects/backgammon")}
                      className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                      {t("backgammon.backToLobby", "Back to Lobby")}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tutorial Overlay */}
            {showTutorial && (
              <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                    {t("backgammon.tutorialTitle", "How to Play Backgammon")}
                  </h3>
                  <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                    <p>
                      1. <strong>{t("backgammon.tutorialRule1")}</strong>
                    </p>
                    <p>
                      2. <strong>{t("backgammon.tutorialRule2")}</strong>
                    </p>
                    <p>
                      3. <strong>{t("backgammon.tutorialRule3")}</strong>
                    </p>
                    <p>
                      4. <strong>{t("backgammon.tutorialRule4")}</strong>
                    </p>
                    <p>
                      5. <strong>{t("backgammon.tutorialRule5")}</strong>
                    </p>
                    <p>
                      6. <strong>{t("backgammon.tutorialRule6")}</strong>
                    </p>
                  </div>
                  <button
                    onClick={() => setShowTutorial(false)}
                    className="mt-4 w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-lg"
                  >
                    {t("backgammon.tutorialGotIt", "Got it!")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reset Button */}
    </div>
  );
}
