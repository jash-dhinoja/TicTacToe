// src/app/tic-tac-toe.service.ts
import { Injectable } from '@angular/core';
import { Client, Room } from 'colyseus.js';
import { GameState } from '../server/src/GameState';
import { TicTacToeRoom } from '../server/src/TicTacToeRoom';

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
    try {
      this.room = await this.client.joinById(roomId, { roomId, userName });
      console.log('Flag 1', this.room);
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
