"use client";

import { useTranslation } from "react-i18next";
import { BackgammonGameState, Player } from "../types";

interface GameInfoProps {
  gameState: BackgammonGameState;
  players: [Player, Player];
  playerIndex: number | null;
  connected: boolean;
  gameMode: "online" | "offline";
  onRollDice: () => void;
  onLeaveGame: () => void;
  onShowTutorial: () => void;
  onResetGame?: () => void;
}

export default function GameInfo({
  gameState,
  players,
  playerIndex,
  connected,
  gameMode,
  onRollDice,
  onLeaveGame,
  onShowTutorial,
  onResetGame,
}: GameInfoProps) {
  const { t } = useTranslation();

  const currentPlayer = players[gameState.currentPlayer];
  const isMyTurn = gameState.currentPlayer === playerIndex;
  const canRoll =
    isMyTurn && !gameState.rolled && gameState.phase === "playing";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Players Info */}
        <div className="flex flex-col sm:flex-row gap-4">
          {players.map((player, index) => (
            <div
              key={player.id}
              className={`flex items-center space-x-3 p-2 rounded-lg ${
                index === gameState.currentPlayer
                  ? "bg-amber-100 dark:bg-amber-900 ring-2 ring-amber-500"
                  : "bg-gray-100 dark:bg-gray-700"
              } ${index === playerIndex ? "border-2 border-blue-500" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-base border-2 ${
                  index === 0
                    ? "bg-white text-black border-gray-800"
                    : "bg-black text-white border-gray-900"
                }`}
              >
                {player.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {index === playerIndex
                    ? player.name // Only show your name if you are the current user
                    : player.name || (index === 1 ? "AI" : "Opponent")}
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {index === 0
                    ? t("backgammon.white", "White")
                    : t("backgammon.black", "Black")}
                </span>
              </div>
              {index === gameState.currentPlayer && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              )}
            </div>
          ))}
        </div>

        {/* Game Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Connection Status */}
          {gameMode === "online" && (
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  connected ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {connected
                  ? t("backgammon.connected", "Connected")
                  : t("backgammon.disconnected", "Disconnected")}
              </span>
            </div>
          )}

          {/* Dice Display */}
          <div className="flex space-x-3">
            {(() => {
              // For display purposes, show unique dice values
              const uniqueDice =
                gameState.dice.length <= 2
                  ? gameState.dice
                  : [gameState.dice[0], gameState.dice[0]]; // Show doubles as two dice

              // Pad with zeros to always show 2 dice
              const displayDice = [...uniqueDice, 0, 0].slice(0, 2);

              return displayDice.map((die, index) => (
                <div
                  key={index}
                  className={`w-14 h-14 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-gray-700 dark:to-gray-800 border-3 border-amber-300 dark:border-amber-600 rounded-xl flex items-center justify-center font-bold text-amber-800 dark:text-amber-200 shadow-lg transform transition-all duration-300 ${
                    gameState.rolled
                      ? "animate-bounce scale-110"
                      : "hover:scale-105"
                  }`}
                >
                  {die ? (
                    <div className="text-2xl font-bold">
                      {die === 1 && (
                        <div className="flex items-center justify-center w-full h-full">
                          <div className="w-2 h-2 bg-amber-800 dark:bg-amber-200 rounded-full"></div>
                        </div>
                      )}
                      {die === 2 && (
                        <div className="flex items-center justify-between w-full h-full p-2">
                          <div className="w-2 h-2 bg-amber-800 dark:bg-amber-200 rounded-full"></div>
                          <div className="w-2 h-2 bg-amber-800 dark:bg-amber-200 rounded-full"></div>
                        </div>
                      )}
                      {die === 3 && (
                        <div className="flex flex-col items-center justify-between w-full h-full p-2">
                          <div className="w-2 h-2 bg-amber-800 dark:bg-amber-200 rounded-full"></div>
                          <div className="w-2 h-2 bg-amber-800 dark:bg-amber-200 rounded-full"></div>
                          <div className="w-2 h-2 bg-amber-800 dark:bg-amber-200 rounded-full"></div>
                        </div>
                      )}
                      {die === 4 && (
                        <div className="grid grid-cols-2 gap-1 p-2 w-full h-full">
                          <div className="w-2 h-2 bg-amber-800 dark:bg-amber-200 rounded-full"></div>
                          <div className="w-2 h-2 bg-amber-800 dark:bg-amber-200 rounded-full"></div>
                          <div className="w-2 h-2 bg-amber-800 dark:bg-amber-200 rounded-full"></div>
                          <div className="w-2 h-2 bg-amber-800 dark:bg-amber-200 rounded-full"></div>
                        </div>
                      )}
                      {die === 5 && (
                        <div className="grid grid-cols-2 gap-1 p-2 w-full h-full">
                          <div className="w-2 h-2 bg-amber-800 dark:bg-amber-200 rounded-full"></div>
                          <div className="w-2 h-2 bg-amber-800 dark:bg-amber-200 rounded-full"></div>
                          <div className="w-2 h-2 bg-amber-800 dark:bg-amber-200 rounded-full mx-auto col-span-2"></div>
                          <div className="w-2 h-2 bg-amber-800 dark:bg-amber-200 rounded-full"></div>
                          <div className="w-2 h-2 bg-amber-800 dark:bg-amber-200 rounded-full"></div>
                        </div>
                      )}
                      {die === 6 && (
                        <div className="grid grid-cols-2 gap-1 p-2 w-full h-full">
                          <div className="w-2 h-2 bg-amber-800 dark:bg-amber-200 rounded-full"></div>
                          <div className="w-2 h-2 bg-amber-800 dark:bg-amber-200 rounded-full"></div>
                          <div className="w-2 h-2 bg-amber-800 dark:bg-amber-200 rounded-full"></div>
                          <div className="w-2 h-2 bg-amber-800 dark:bg-amber-200 rounded-full"></div>
                          <div className="w-2 h-2 bg-amber-800 dark:bg-amber-200 rounded-full"></div>
                          <div className="w-2 h-2 bg-amber-800 dark:bg-amber-200 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xl font-bold text-gray-400">-</div>
                  )}
                </div>
              ));
            })()}
          </div>

          {/* Moves remaining indicator for doubles */}
          {gameState.dice.length > 2 && (
            <div className="text-sm text-amber-300 mt-2">
              {t("backgammon.movesRemaining")}:{" "}
              {gameState.dice.filter((d) => d > 0).length}
            </div>
          )}

          {/* Roll Dice Button */}
          <button
            onClick={onRollDice}
            disabled={!canRoll}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              canRoll
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            }`}
          >
            {gameState.rolled
              ? t("backgammon.makeMove", "Make Move")
              : t("backgammon.rollDice", "Roll Dice")}
          </button>

          {/* Show Tutorial Button */}
          {onShowTutorial && (
            <button
              onClick={onShowTutorial}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              {t("backgammon.help")}
            </button>
          )}

          {/* Leave Game Button */}
          <button
            onClick={onLeaveGame}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            {t("backgammon.leaveGame", "Leave Game")}
          </button>

          {/* Reset Game Button */}
          {onResetGame && (
            <button
              onClick={onResetGame}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              {t("backgammon.resetGame", "Reset Game")}
            </button>
          )}
        </div>
      </div>

      {/* Current Turn Info */}
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex flex-col">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isMyTurn ? (
                <span className="text-green-600 dark:text-green-400 font-medium animate-pulse">
                  {t("backgammon.yourTurn", "Your turn!")}
                </span>
              ) : (
                <span className="text-orange-600 dark:text-orange-400">
                  {currentPlayer.name === "AI" ? (
                    <span className="animate-pulse">
                      {t("backgammon.aiThinking", "AI is thinking...")}
                    </span>
                  ) : (
                    <span>
                      {t("backgammon.waitingFor", "Waiting for")}{" "}
                      <strong>{currentPlayer.name}</strong>
                    </span>
                  )}
                </span>
              )}
            </p>

            {/* Game Instructions */}
            {isMyTurn && !gameState.rolled && (
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                {t("backgammon.clickRollDiceToStart")}
              </p>
            )}

            {isMyTurn && gameState.rolled && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                {t("backgammon.clickPiecesToMove")}
              </p>
            )}
          </div>

          {gameState.lastMove && (
            <div className="flex flex-col">
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {t("backgammon.lastMove", "Last move")}:
              </p>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {gameState.lastMove}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
