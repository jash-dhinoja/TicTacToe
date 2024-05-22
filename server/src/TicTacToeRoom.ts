// src/TicTacToeRoom.ts
import { Room, Client } from "colyseus";
import { GameState } from "./GameState";

class TicTacToeRoom extends Room<GameState> {
  // maxClients: number = 2;

  onCreate(options: any) {
    this.setState(new GameState());

    const { roomId } = options;

    this.roomId = roomId;

    this.onMessage("make_move", (message) => {
      this.state.makeMove(message, (index) => {
        this.broadcast("update-board", index);
      });
    });
    this.onMessage("reset-game", () => {
      this.state.resetGame();
      this.broadcast("reset-client");
    });
  }

  onJoin(client: Client, options: any) {
    // If we want spectators
    if (this.state.players.size < 2) {
      const { userName } = options;

      this.state.players.set(userName, client.sessionId);

      if (this.state.players.size === 2) {
        this.state.currentPlayer = userName;
        this.broadcast("play");
        return;
      }
      this.broadcast("wait");
      return;
    }
    client.send("spectator");

    // if we want to keep only 2 members per room
    // const { userName } = options;

    // this.state.players.set(userName, client.sessionId);

    // if (this.state.players.size === 2) {
    //   this.state.currentPlayer = userName;
    //   this.broadcast('play');
    //   this.lock();
    //   return;
    // }
    // this.broadcast('wait');
  }

  onLeave(client: Client, consented: boolean) {
    this.state.players.forEach(
      (value, key) =>
        value === client.sessionId && this.state.players.delete(key)
    );
    client.leave();
  }

  onDispose() {
    // Clean up resources if necessary
  }
}

export { TicTacToeRoom };
