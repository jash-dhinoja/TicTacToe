// src/GameState.ts
import { type, Schema, ArraySchema, MapSchema } from "@colyseus/schema";
import { Client } from "colyseus";

class GameState extends Schema {
  @type(["string"])
  board: ArraySchema<string> = new ArraySchema(
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
  );

  @type("string")
  currentSymbol: string = "X";

  @type({ map: "string" }) players = new MapSchema<string>();

  @type("boolean")
  gameOver: boolean = false;

  @type("string")
  currentPlayer = "";

  @type("string")
  winner: string = "";
  /**
   * Registers move onto the board
   * @param message Index of the move and username
   * @param updateBoardCallback
   * @returns
   */
  makeMove(message: any, updateBoardCallback: (index: number) => void) {
    const { index, userName } = message;

    if (
      this.board[index] === "" &&
      !this.gameOver &&
      this.currentPlayer === userName
    ) {
      const playerIds = Array.from(this.players.keys());

      this.board[index] = this.currentSymbol;

      updateBoardCallback(index);

      if (this.checkWin()) {
        this.gameOver = true;
        this.winner = userName;
      } else if (this.board.every((cell) => cell !== "")) {
        this.gameOver = true;
        this.winner = "Draw";
      } else {
        this.currentSymbol = this.currentSymbol === "X" ? "O" : "X";
        const otherPlayerSessionId =
          userName === playerIds[0] ? playerIds[1] : playerIds[0];

        this.currentPlayer = otherPlayerSessionId;
      }
      return true;
    }
    return false;
  }
  /**
   * Checks if the there is a winner
   * @returns Win
   */
  checkWin(): boolean {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    return winningCombinations.some((combination) =>
      combination.every((index) => this.board[index] === this.currentSymbol)
    );
  }
  /**
   * Resets the state variable
   */
  resetGame() {
    console.log("Server Game Reset");
    this.board = new ArraySchema("", "", "", "", "", "", "", "", "");
    this.currentSymbol = "X";
    this.gameOver = false;
    this.winner = "";
    this.currentPlayer = Array.from(this.players.keys())[0];
  }
}

export { GameState };
