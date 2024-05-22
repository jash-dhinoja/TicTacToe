// src/app/tic-tac-toe.service.ts
import { Injectable } from '@angular/core';
import { Client, Room, RoomAvailable } from 'colyseus.js';
import { GameState } from '../../../server/src/GameState';

@Injectable({
  providedIn: 'root',
})
export class TicTacToeService {
  private client: Client = new Client('ws://localhost:2567');
  private room!: Room;
  private lobby!: Room;
  /**
   * Initializes and joins the lobby room
   * @returns Lobby Room
   */
  async initializeLobby(): Promise<Room<any>> {
    this.lobby = await this.client.joinOrCreate('lobby');
    return this.lobby;
  }
  /**
   * Creates or joins a room based on the Room id and username
   * @param roomId Room id
   * @param userName Username
   * @returns
   */
  async joinOrCreateRoom(roomId: string, userName: string) {
    try {
      this.room = await this.client.joinById(roomId, { roomId, userName });
      return this.room;
    } catch (error) {
      console.log(error);
    }

    this.room = await this.client.create('tic-tac-toe', {
      roomId,
      userName,
    });
    return this.room;
  }
  /**
   * Sends a reset game message to the server
   */
  resetGame() {
    this.room.send('reset-game');
  }
  /**
   * Sends the move made to the server
   * @param index Move
   * @param userName Username
   */
  makeMove(index: number, userName: string) {
    this.room.send('make_move', { index, userName });
  }
  /**
   * Listens to the state change on the server
   * @param callback state change callback
   */
  onStateChange(callback: (state: GameState) => void) {
    this.room.onStateChange(callback);
  }
}
