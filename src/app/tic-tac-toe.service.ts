// src/app/tic-tac-toe.service.ts
import { Injectable } from '@angular/core';
import { Client, Room } from 'colyseus.js';
import { GameState } from '../server/src/GameState';

@Injectable({
  providedIn: 'root',
})
export class TicTacToeService {
  private client: Client;
  private room!: Room;

  constructor() {
    this.client = new Client('ws://localhost:2567');
  }

  async joinOrCreateRoom(roomId: string, userName: string) {
    this.room = await this.client.joinOrCreate('tic-tac-toe', {
      roomId,
      userName,
    });
    return this.room;
  }

  resetGame() {
    this.room.send('reset-game');
  }

  makeMove(index: number, userName: string) {
    this.room.send('make_move', { index, userName });
  }

  onStateChange(callback: (state: GameState) => void) {
    this.room.onStateChange(callback);
  }
}
