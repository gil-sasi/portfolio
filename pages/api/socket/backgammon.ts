import { NextApiRequest, NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import type { Server as NetServer } from "net";
import type { Socket as NetSocket } from "net";
import type { Server as SocketIOServerType } from "socket.io";

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: NetSocket & {
    server: NetServer & {
      io?: SocketIOServerType;
    };
  };
}

interface Player {
  id: string;
  name: string;
  socketId: string;
  isReady: boolean;
  inGame: boolean;
}

interface GameRoom {
  id: string;
  players: [Player, Player];
  gameState: BackgammonGameState;
  spectators: Player[];
  createdAt: Date;
}

interface BackgammonGameState {
  board: number[];
  currentPlayer: 0 | 1;
  dice: [number, number];
  rolled: boolean;
  phase: "setup" | "playing" | "finished";
  winner: number | null;
  bar: [number, number]; // pieces on the bar for each player
  bearOff: [number, number]; // pieces bearing off for each player
  moveCount: number;
  lastMove: string | null;
}

// Global state management
const players: Map<string, Player> = new Map();
const gameRooms: Map<string, GameRoom> = new Map();
const waitingPlayers: Set<string> = new Set();

const createInitialGameState = (): BackgammonGameState => ({
  board: [
    0, 2, 0, 0, 0, 0, -5, 0, -3, 0, 0, 0, 5, -5, 0, 0, 0, 3, 0, 5, 0, 0, 0, 0,
    -2, 0,
  ],
  currentPlayer: Math.random() < 0.5 ? 0 : 1,
  dice: [0, 0],
  rolled: false,
  phase: "setup",
  winner: null,
  bar: [0, 0],
  bearOff: [0, 0],
  moveCount: 0,
  lastMove: null,
});

const generateRoomId = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Ensure res.socket and res.socket.server exist and are typed correctly
  const resWithSocket = res as NextApiResponseWithSocket;
  if (resWithSocket.socket?.server?.io) {
    console.log("Socket.IO already running");
    res.end();
    return;
  }

  console.log("Starting Socket.IO server for backgammon");

  const httpServer: HttpServer = resWithSocket.socket.server as HttpServer;
  const io = new SocketIOServer(httpServer, {
    path: "/api/socket/backgammon",
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("join-lobby", ({ playerName }: { playerName: string }) => {
      const player: Player = {
        id: socket.id,
        name: playerName,
        socketId: socket.id,
        isReady: false,
        inGame: false,
      };

      players.set(socket.id, player);
      waitingPlayers.add(socket.id);

      socket.join("lobby");

      // Send current lobby state to the new player
      const lobbyPlayers = Array.from(waitingPlayers)
        .map((id) => players.get(id)!)
        .filter((p) => !p.inGame);
      socket.emit("lobby-state", { players: lobbyPlayers });

      // Notify other players in lobby
      socket.to("lobby").emit("player-joined", player);

      console.log(`Player ${playerName} joined lobby`);
    });

    socket.on(
      "challenge-player",
      ({ targetPlayerId }: { targetPlayerId: string }) => {
        const challenger = players.get(socket.id);
        const target = players.get(targetPlayerId);

        if (!challenger || !target || target.inGame) {
          socket.emit("challenge-failed", { message: "Player not available" });
          return;
        }

        // Send challenge to target player
        io.to(targetPlayerId).emit("challenge-received", {
          from: challenger,
          challengeId: socket.id + "_" + targetPlayerId,
        });

        console.log(`${challenger.name} challenged ${target.name}`);
      }
    );

    socket.on(
      "challenge-response",
      ({
        challengeId,
        accepted,
        challengerId,
      }: {
        challengeId: string;
        accepted: boolean;
        challengerId: string;
      }) => {
        const challenger = players.get(challengerId);
        const accepter = players.get(socket.id);

        if (!challenger || !accepter) {
          return;
        }

        if (accepted) {
          // Create game room
          const roomId = generateRoomId();
          const gameRoom: GameRoom = {
            id: roomId,
            players: [challenger, accepter],
            gameState: createInitialGameState(),
            spectators: [],
            createdAt: new Date(),
          };

          gameRooms.set(roomId, gameRoom);

          // Update player states
          challenger.inGame = true;
          accepter.inGame = true;

          // Remove from waiting list
          waitingPlayers.delete(challengerId);
          waitingPlayers.delete(socket.id);

          // Join game room
          io.sockets.sockets.get(challengerId)?.join(roomId);
          socket.join(roomId);

          // Leave lobby
          io.sockets.sockets.get(challengerId)?.leave("lobby");
          socket.leave("lobby");

          // Start game
          io.to(roomId).emit("game-started", {
            roomId,
            players: gameRoom.players,
            gameState: gameRoom.gameState,
          });

          // Update lobby
          const lobbyPlayers = Array.from(waitingPlayers)
            .map((id) => players.get(id)!)
            .filter((p) => !p.inGame);
          io.to("lobby").emit("lobby-state", { players: lobbyPlayers });

          console.log(
            `Game started between ${challenger.name} and ${accepter.name}`
          );
        } else {
          // Challenge declined
          io.to(challengerId).emit("challenge-declined", { by: accepter });
        }
      }
    );

    socket.on("roll-dice", ({ roomId }: { roomId: string }) => {
      const room = gameRooms.get(roomId);
      if (!room) return;

      const playerIndex = room.players.findIndex(
        (p) => p.socketId === socket.id
      );
      if (
        playerIndex === -1 ||
        room.gameState.currentPlayer !== playerIndex ||
        room.gameState.rolled
      ) {
        return;
      }

      // Roll dice
      const dice1 = Math.floor(Math.random() * 6) + 1;
      const dice2 = Math.floor(Math.random() * 6) + 1;

      room.gameState.dice = [dice1, dice2];
      room.gameState.rolled = true;

      io.to(roomId).emit("dice-rolled", {
        dice: [dice1, dice2],
        player: playerIndex,
        gameState: room.gameState,
      });

      console.log(`Player ${playerIndex} rolled: ${dice1}, ${dice2}`);
    });

    socket.on(
      "make-move",
      ({ roomId, move }: { roomId: string; move: any }) => {
        const room = gameRooms.get(roomId);
        if (!room) return;

        const playerIndex = room.players.findIndex(
          (p) => p.socketId === socket.id
        );
        if (
          playerIndex === -1 ||
          room.gameState.currentPlayer !== playerIndex
        ) {
          return;
        }

        // Validate and apply move (simplified for now)
        // In a real implementation, you would validate the move against game rules

        room.gameState.moveCount++;
        room.gameState.lastMove = `Player ${playerIndex} moved`;

        // Switch turns after move
        room.gameState.currentPlayer = playerIndex === 0 ? 1 : 0;
        room.gameState.rolled = false;

        io.to(roomId).emit("move-made", {
          move,
          playerIndex,
          gameState: room.gameState,
        });

        console.log(`Player ${playerIndex} made move in room ${roomId}`);
      }
    );

    socket.on("leave-game", ({ roomId }: { roomId: string }) => {
      const room = gameRooms.get(roomId);
      if (!room) return;

      const playerIndex = room.players.findIndex(
        (p) => p.socketId === socket.id
      );
      if (playerIndex === -1) return;

      // End game
      room.gameState.phase = "finished";
      room.gameState.winner = playerIndex === 0 ? 1 : 0;

      io.to(roomId).emit("game-ended", {
        winner: room.gameState.winner,
        reason: "opponent_left",
      });

      // Clean up
      room.players.forEach((player) => {
        player.inGame = false;
        waitingPlayers.add(player.socketId);
        io.sockets.sockets.get(player.socketId)?.join("lobby");
      });

      gameRooms.delete(roomId);

      console.log(`Player left game ${roomId}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);

      const player = players.get(socket.id);
      if (player) {
        // Remove from waiting list
        waitingPlayers.delete(socket.id);

        // Find and end any active games
        for (const [roomId, room] of gameRooms.entries()) {
          const playerIndex = room.players.findIndex(
            (p) => p.socketId === socket.id
          );
          if (playerIndex !== -1) {
            // End game
            room.gameState.phase = "finished";
            room.gameState.winner = playerIndex === 0 ? 1 : 0;

            io.to(roomId).emit("game-ended", {
              winner: room.gameState.winner,
              reason: "opponent_disconnected",
            });

            // Clean up other player
            const otherPlayer = room.players[playerIndex === 0 ? 1 : 0];
            if (otherPlayer) {
              otherPlayer.inGame = false;
              waitingPlayers.add(otherPlayer.socketId);
              io.sockets.sockets.get(otherPlayer.socketId)?.join("lobby");
            }

            gameRooms.delete(roomId);
            break;
          }
        }

        // Remove player
        players.delete(socket.id);

        // Update lobby
        const lobbyPlayers = Array.from(waitingPlayers)
          .map((id) => players.get(id)!)
          .filter((p) => p && !p.inGame);
        io.to("lobby").emit("lobby-state", { players: lobbyPlayers });
      }
    });
  });

  resWithSocket.socket.server.io = io;
  res.end();
}
