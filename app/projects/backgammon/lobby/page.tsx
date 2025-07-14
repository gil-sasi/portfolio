"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { io, Socket } from "socket.io-client";

interface Player {
  id: string;
  name: string;
  socketId: string;
  isReady: boolean;
  inGame: boolean;
}

interface Challenge {
  from: Player;
  challengeId: string;
}

export default function BackgammonLobby() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [connected, setConnected] = useState(false);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const initializeSocket = useCallback(async () => {
    try {
      await fetch("/api/socket/backgammon");
      const newSocket = io({
        path: "/api/socket/backgammon",
        forceNew: true,
      });

      newSocket.on("connect", () => {
        console.log("Connected to server");
        setConnected(true);
        setIsConnecting(false);

        const name = searchParams?.get("name") || "Anonymous";
        setPlayerName(name);
        newSocket.emit("join-lobby", { playerName: name });
      });

      newSocket.on("lobby-state", ({ players: lobbyPlayers }) => {
        setPlayers(lobbyPlayers);
      });

      newSocket.on("player-joined", (player: Player) => {
        setPlayers((prev) => [...prev, player]);
      });

      newSocket.on("challenge-received", (challengeData: Challenge) => {
        setChallenge(challengeData);
      });

      newSocket.on("challenge-failed", ({ message }) => {
        alert(message);
      });

      newSocket.on("challenge-declined", ({ by }) => {
        alert(`${by.name} declined your challenge`);
      });

      newSocket.on("game-started", ({ roomId }) => {
        router.push(`/projects/backgammon/game?roomId=${roomId}`);
      });

      newSocket.on("disconnect", () => {
        console.log("Disconnected from server");
        setConnected(false);
        setIsConnecting(true);
      });

      setSocket(newSocket);
    } catch (error) {
      console.error("Failed to initialize socket:", error);
      setIsConnecting(false);
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (!searchParams?.get("name")) {
      router.push("/projects/backgammon");
      return;
    }

    initializeSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [searchParams, router, initializeSocket, socket]);

  const handleChallenge = useCallback(
    (targetPlayerId: string) => {
      if (socket && connected) {
        socket.emit("challenge-player", { targetPlayerId });
      }
    },
    [socket, connected]
  );

  const handleChallengeResponse = useCallback(
    (accepted: boolean) => {
      if (socket && connected && challenge) {
        socket.emit("challenge-response", {
          challengeId: challenge.challengeId,
          accepted,
          challengerId: challenge.from.socketId,
        });
        setChallenge(null);
      }
    },
    [socket, connected, challenge]
  );

  const handleBackToMenu = useCallback(() => {
    if (socket) {
      socket.disconnect();
    }
    router.push("/projects/backgammon");
  }, [socket, router]);

  if (isConnecting) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 animated-bg opacity-5"></div>
        <div className="pt-20 pb-12 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-300 text-lg">
              {t("backgammon.connecting", "Connecting to game lobby...")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 animated-bg opacity-5"></div>
      <div className="absolute top-10 right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-orange-500/10 rounded-full blur-xl"></div>

      <div className="relative z-10 px-4 sm:px-6 py-8 sm:py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="glass rounded-2xl p-8 max-w-2xl mx-auto mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {t("backgammon.gameLobby", "Game Lobby")}
            </h1>
            <p className="text-gray-300 mb-4">
              {t("backgammon.welcomePlayer", "Welcome")}, {playerName}!
            </p>
            <div className="flex items-center justify-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  connected ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span className="text-sm text-gray-300">
                {connected
                  ? t("backgammon.connected", "Connected")
                  : t("backgammon.disconnected", "Disconnected")}
              </span>
            </div>
          </div>
        </div>

        {/* Players List */}
        <div className="modern-card p-6 mb-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {t("backgammon.onlinePlayers", "Online Players")} (
              {players.length})
            </h2>
            <button
              onClick={handleBackToMenu}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              {t("backgammon.backToMenu", "Back to Menu")}
            </button>
          </div>

          {players.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎲</div>
              <p className="text-gray-300 text-lg">
                {t("backgammon.noPlayersOnline", "No other players online")}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {t(
                  "backgammon.shareLink",
                  "Share the link with friends to play together!"
                )}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="bg-gray-800 rounded-xl p-4 border border-gray-700"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                        {player.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">
                          {player.name}
                        </h3>
                        <p className="text-xs text-amber-400">
                          {player.inGame
                            ? t("backgammon.inGame", "In Game")
                            : t("backgammon.available", "Available")}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-3 h-3 rounded-full ${
                        player.inGame ? "bg-red-500" : "bg-green-500"
                      }`}
                    ></div>
                  </div>

                  <button
                    onClick={() => handleChallenge(player.id)}
                    disabled={player.inGame}
                    className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    {player.inGame
                      ? t("backgammon.inGame", "In Game")
                      : t("backgammon.challenge", "Challenge")}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="modern-card p-6 max-w-4xl mx-auto">
          <h3 className="text-lg font-bold text-white mb-4">
            {t("backgammon.howToPlay", "How to Play")}
          </h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start space-x-2">
              <span className="text-amber-400">1.</span>
              <span>
                {t(
                  "backgammon.stepOne",
                  "Wait for other players to join or challenge someone available"
                )}
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-amber-400">2.</span>
              <span>
                {t(
                  "backgammon.stepTwo",
                  "When challenged, accept to start a game"
                )}
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-amber-400">3.</span>
              <span>
                {t("backgammon.stepThree", "Play backgammon and try to win!")}
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Challenge Modal */}
      {challenge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="modern-card p-6 max-w-md w-full">
            <div className="text-center">
              <div className="text-4xl mb-4">🎲</div>
              <h3 className="text-xl font-bold text-white mb-2">
                {t("backgammon.challengeReceived", "Challenge Received!")}
              </h3>
              <p className="text-gray-300 mb-6">
                {t("backgammon.challengeFrom", "from")}{" "}
                <strong>{challenge.from.name}</strong>{" "}
                {t(
                  "backgammon.wantsToPlay",
                  "wants to play backgammon with you"
                )}
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleChallengeResponse(true)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  {t("backgammon.accept", "Accept")}
                </button>
                <button
                  onClick={() => handleChallengeResponse(false)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  {t("backgammon.decline", "Decline")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
